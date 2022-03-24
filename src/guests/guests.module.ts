import { forwardRef, Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from '../schemas/guest.schema';
import { GuestsController } from './guests.controller';
import { BotModule } from '../bot/bot.module';
import { GuestsRemoveKeyboardHandler } from './command-handlers/guests.remove-keyboard.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GuestsPrepareGameEventHandler } from './command-handlers/guests.prepare-game.event.handler';
import { GuestCardDealedEventHandler } from './event-handlers/guest-card-dealed.event.handler';
import { CardsModule } from '../cards/cards.module';
import { GuestValidAnswerReceivedEventHandler } from './event-handlers/guest-valid-answer-received-event.handler';
import { GuestGameStartEventHandler } from './event-handlers/guest-game-start-event.handler';
import { GuestsResetPlayerPrizeChanceCommandHandler } from './command-handlers/reset-player-prize-chance-command.handler';
import { GuestQuizAnswerStateChangedEventHandler } from './event-handlers/guest-quiz-answer-state-changed-event.handler';
import { GiveCardsCommandHandler } from '../game/comand-handlers/give-cards-command.handler';
import { IncreasePlayerWinningRateCommandHandler } from './command-handlers/increase-player-winning-rate-command.handler';

const commandHandlers = [
  GuestsRemoveKeyboardHandler,
  GuestsResetPlayerPrizeChanceCommandHandler,
  IncreasePlayerWinningRateCommandHandler,
];

const eventHandlers = [
  GuestsPrepareGameEventHandler,
  GuestCardDealedEventHandler,
  GuestValidAnswerReceivedEventHandler,
  GuestGameStartEventHandler,
  GuestQuizAnswerStateChangedEventHandler,
  GiveCardsCommandHandler,
]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
    forwardRef(() => BotModule),
    CqrsModule,
    CardsModule,
  ],
  providers: [GuestsService, ...commandHandlers, ...eventHandlers],
  exports: [GuestsService],
  controllers: [GuestsController],
})
export class GuestsModule {}
