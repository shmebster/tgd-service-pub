import { forwardRef, Global, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizAnsweredEventHandler } from './event-handlers/quiz-answered-event.handler';
import { CardSelectionPendingEventHandler } from './event-handlers/card-selection-pending-event.handler';
import { PlayerCardSelectedEventHandler } from './event-handlers/player-card-selected-event.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { GameQueue, GameQueueSchema } from '../schemas/game-queue.schema';
import { CreateNewQueueItemCommandHandler } from './comand-handlers/create-new-queue-item-command.handler';
import { GamePrepareGameEventHandler } from './event-handlers/prepare-game-event.handler';
import { GamePrizeChanceIncreasedEventHandler } from './event-handlers/prize-chance-increased-event.handler';
import { GameGiveOutAPrizeCommandHandler } from './comand-handlers/give-out-a-prize-command.handler';
import { GameProceedGameQueueCommandHandler } from './comand-handlers/proceed-game-queue-command.handler';
import { GameWrongAnswerReceivedEventHandler } from './event-handlers/wrong-answer-received-event.handler';
import { GameController } from './game.controller';
import { PenaltyModule } from '../penalty/penalty.module';
import { PenaltyService } from '../penalty/penalty.service';

const eventHandlers = [
  QuizAnsweredEventHandler,
  CardSelectionPendingEventHandler,
  PlayerCardSelectedEventHandler,
  GamePrepareGameEventHandler,
  GamePrizeChanceIncreasedEventHandler,
  GameGiveOutAPrizeCommandHandler,
  GameWrongAnswerReceivedEventHandler
];

const commandHandlers = [
  CreateNewQueueItemCommandHandler,
  GamePrizeChanceIncreasedEventHandler,
  GameProceedGameQueueCommandHandler
];
@Global()
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: GameQueue.name, schema: GameQueueSchema },
    ]),
  ],
  providers: [GameService, ...eventHandlers, ...commandHandlers],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}
