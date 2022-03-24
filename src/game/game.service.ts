import { Injectable, InternalServerErrorException, Logger, Scope } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { CardSelectionTimeExceedCommand } from './commands/card-selection-time-exceed.command';
import { TGD_Config } from '../../app.config';
import { InjectModel } from '@nestjs/mongoose';
import {
  GameQueue,
  GameQueueDocument,
  GameQueueTypes,
} from '../schemas/game-queue.schema';
import { Model, Mongoose, Schema } from 'mongoose';
import { ProceedGameQueueCommand } from './commands/proceed-game-queue.command';
import { SharedService } from '../shared/shared.service';
import { SocketEvents } from '../shared/events.consts';

@Injectable({ scope: Scope.TRANSIENT })
export class GameService {

  private readonly logger = new Logger(GameService.name);
  constructor(
    private cmdBus: CommandBus,
    private eventBus: EventBus,
    @InjectModel(GameQueue.name)
    private gameQueueModel: Model<GameQueueDocument>,
    private sharedService: SharedService,
  ) {}

  public beginCardSelectionScene() {
    setTimeout(async () => {
      await this.cmdBus.execute(new CardSelectionTimeExceedCommand());
    }, TGD_Config.sceneDelay * 1000);
  }

  async addTaskToGameQueue(target: number, type: GameQueueTypes) {
    this.logger.verbose(`Adding to game queue ${type} for player ${target}`)
    const q = new this.gameQueueModel({
      type: type,
      target: target,
    });
    await q.save();
  }

  async cleanGameQueue() {
    this.logger.verbose(`Cleaning game queue`);
    await this.gameQueueModel.deleteMany({});
  }

  async getGameQueueItem() {
    return this.gameQueueModel.findOne({ completed: false }).exec();
  }

  async markQueueAsCompleted(id: string) {
    const qItem = await this.gameQueueModel.findById(id).exec();
    console.warn(qItem);
    this.logger.verbose(`Set ${id} in queue as completed`);
    if (!qItem) {
      throw new InternalServerErrorException('no such item');
    }
    qItem.completed = true;
    await qItem.save();
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.QUEUE_COMPLETED,
      {},
    );
    await this.cmdBus.execute(new ProceedGameQueueCommand());
    return qItem;
  }

  async pauseGame() {
    await this.sharedService.setConfig('game_state', 'paused');
    await this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.GAME_PAUSED,
      {},
    );
    return Promise.resolve({ result: true });
  }

  async resumeGame() {
    await this.sharedService.setConfig('game_state', 'running');
    await this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.GAME_RESUMED,
      {},
    );
    return Promise.resolve({ result: true });
  }

  getState() {
    return this.sharedService.getConfig('game_state');
  }
}
