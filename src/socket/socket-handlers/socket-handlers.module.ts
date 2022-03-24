import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { UserRegisteredEventHandler } from './event-handlers/user-registered.event.handler';
import { CardsUpdatedEventHandler } from './event-handlers/cards-updated.event.handler';
import { CardsSetChangedEventHandler } from './event-handlers/cards-set-changed-event.handler';
import { NotifyCardPlayedCommandHandler } from './commands-handlers/notify-card-played-command.handler';
import { SocketValidAnswerReceivedEventHandler } from './event-handlers/valid-answer-received-event.handler';
import { SocketWrongAnswerReceivedEventHandler } from './event-handlers/wrong-answer-received-event.handler';
import { SocketScoreChangedEventHandler } from './event-handlers/score-changed-event.handler';
import { SendToastCommandHandler } from './commands-handlers/send-toast-command-handler';

const commandHandlers = [
  CardsSetChangedEventHandler,
  NotifyCardPlayedCommandHandler,
  SendToastCommandHandler
];

const eventHandlers = [
  UserRegisteredEventHandler,
  CardsUpdatedEventHandler,
  SocketValidAnswerReceivedEventHandler,
  SocketWrongAnswerReceivedEventHandler,
  SocketScoreChangedEventHandler
];

@Module({
  imports: [SharedModule],
  providers: [...eventHandlers, ...commandHandlers],
})
export class SocketHandlersModule {}
