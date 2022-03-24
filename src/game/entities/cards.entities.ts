import { QuizAnswerStateEnum } from './quiz-answer-state.enum';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IncreasePlayerWinningRateCommand } from '../commands/increase-player-winning-rate.command';
import { CreateNewQueueItemCommand } from '../commands/create-new-queue-item.command';
import { GameQueueTypes } from '../../schemas/game-queue.schema';
import { NotifyCardOnScreenCommand } from '../commands/notify-card-on-screen-command';
import { SendToastCommand } from '../commands/send-toast.command';
import { getRandomInt } from '../../helpers/rand-number';
import { GiveOutAPrizeCommand } from '../commands/give-out-a-prize.command';

export class GameCard {
  protected readonly logger = new Logger(GameCard.name);
  protected commandBus: CommandBus;
  protected eventBus: EventBus;
  protected telegramId: number;
  protected destinationTelegramId: number;
  name: string;
  description: string;
  protected target: 'self' | 'player' = 'self';
  protected _emoji: string;
  public dealOnStart = false;
  chance = 0;
  getEmoji() {
    return this._emoji;
  }
  setup(eb: EventBus, cb: CommandBus, tId: number, destTId: number) {
    this.eventBus = eb;
    this.commandBus = cb;
    this.telegramId = tId;
    this.destinationTelegramId = destTId;
    // this.logger.localInsta(this.name);
  }
  async handle() {
    this.logger.verbose(`Card has no handler`);
  }
  mightBePlayed: QuizAnswerStateEnum;
}

export class DoubleTreasureCard extends GameCard {
  name = DoubleTreasureCard.name;
  description = 'Удвоить приз';
  chance = 13;
  _emoji = '💰';
  mightBePlayed = QuizAnswerStateEnum.playerGettingReward;
  async handle(): Promise<void> {
    await this.commandBus.execute(
      new NotifyCardOnScreenCommand(this.telegramId, this),
    );
    await this.commandBus.execute(
      new GiveOutAPrizeCommand(this.telegramId),
    );
  }
}

export class StolePrizeCard extends GameCard {
  name = StolePrizeCard.name;
  description = 'Украсть приз';
  chance = 10;
  _emoji = '🥷🏽';
  mightBePlayed = QuizAnswerStateEnum.someoneGettingReward;
  async handle(): Promise<void> {
    this.logger.verbose(`StolePrize from player ${this.telegramId} to player ${this.destinationTelegramId}`);
    await this.commandBus.execute(
      new NotifyCardOnScreenCommand(this.telegramId, this),
    );
  }
}

export class ShitCard extends GameCard {
  name = ShitCard.name;
  description = 'Говнокарта';
  chance = 55;
  _emoji = '💩';
  mightBePlayed = QuizAnswerStateEnum.someoneAnsweredCorrectly;

  async handle(): Promise<void> {
    this.logger.verbose(`Shit card from player ${this.telegramId} to player ${this.destinationTelegramId}`);
    await this.commandBus.execute(
      new NotifyCardOnScreenCommand(this.telegramId, this),
    );
    await this.commandBus.execute(
      new CreateNewQueueItemCommand(
        this.destinationTelegramId,
        GameQueueTypes.additionalQuestion,
      ),
    );
  }
}

export class LuckyCard extends GameCard {
  name = LuckyCard.name;
  description = 'Лаки-карта';
  chance = 35;
  mightBePlayed = QuizAnswerStateEnum.playerAnsweredCorrectly;
  _emoji = '🍀';
  async handle() {
    this.logger.verbose(`Handling card`);
    await this.commandBus.execute(
      new NotifyCardOnScreenCommand(this.telegramId, this),
    );
    await this.commandBus.execute(
      new IncreasePlayerWinningRateCommand(
        this.telegramId,
        getRandomInt(15, 30),
      ),
    );
  }
}

export class AvoidPenaltyCard extends GameCard {
  dealOnStart = true;
  name = AvoidPenaltyCard.name;
  description = 'Избежать наказание';
  chance = 25;
  _emoji = '🏃‍';
  mightBePlayed = QuizAnswerStateEnum.playerGotPenalty;
  async handle() {
    await this.commandBus.execute(
      new NotifyCardOnScreenCommand(this.telegramId, this),
    );
    await this.commandBus.execute(
      new SendToastCommand('Игрок сыграл карту избежания наказания', 5000),
    );
  }
}

// export class ViolenceCard extends GameCard {
//   name = ViolenceCard.name;
//   description = 'Насилие';
//   chance = 10;
//   _emoji = '🧟';
// }

export const gameCards: typeof GameCard[] = [
  DoubleTreasureCard,
  StolePrizeCard,
  ShitCard,
  LuckyCard,
  AvoidPenaltyCard,
];
