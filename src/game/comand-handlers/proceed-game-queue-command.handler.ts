import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProceedGameQueueCommand } from '../commands/proceed-game-queue.command';
import { GameService } from '../game.service';
import { NextQuestionCommand } from '../commands/next-question.command';
import { SharedService } from '../../shared/shared.service';
import { SocketEvents } from '../../shared/events.consts';
import { Logger } from '@nestjs/common';
import { GameQueueTypes } from '../../schemas/game-queue.schema';
import { QuizAnswerStateChangedEvent } from '../events/quiz-answer-state-changed.event';
import { QuizAnswerStateEnum } from '../entities/quiz-answer-state.enum';

@CommandHandler(ProceedGameQueueCommand)
export class GameProceedGameQueueCommandHandler
  implements ICommandHandler<ProceedGameQueueCommand> {
  private readonly logger = new Logger(GameProceedGameQueueCommandHandler.name);
  constructor(
    private gameService: GameService,
    private cmdBus: CommandBus,
    private sharedService: SharedService,
    private eventBus: EventBus,
  ) {}
  async execute(command: ProceedGameQueueCommand) {
    this.logger.verbose(`Proceed with game queue...`);
    const item = await this.gameService.getGameQueueItem();
    if (!item) {
      return this.cmdBus.execute(new NextQuestionCommand());
    }
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.GameQueueItem,
      {
        _id: item.id,
        completed: item.completed,
        target: item.target,
        type: item.type,
      },
    );
    switch (item.type) {
      case GameQueueTypes.giveOutAPrize:
        this.eventBus.publish(
          new QuizAnswerStateChangedEvent(
            QuizAnswerStateEnum.playerGettingReward,
            item.target,
          ),
        );
        break;
      case GameQueueTypes.penalty:
        this.eventBus.publish(
          new QuizAnswerStateChangedEvent(
            QuizAnswerStateEnum.playerGotPenalty,
            item.target,
          ),
        );
        break;
    }
  }
}
