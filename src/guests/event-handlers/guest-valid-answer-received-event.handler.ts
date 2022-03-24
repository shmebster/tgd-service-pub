import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ValidAnswerReceivedEvent } from '../../game/events/valid-answer.recieved';
import { GuestsService } from '../guests.service';
import { QuizAnswerStateChangedEvent } from '../../game/events/quiz-answer-state-changed.event';
import { QuizStateEnum } from '../../game/entities/quiz-state.enum';
import { QuizAnswerStateEnum } from '../../game/entities/quiz-answer-state.enum';

@EventsHandler(ValidAnswerReceivedEvent)
export class GuestValidAnswerReceivedEventHandler implements IEventHandler<ValidAnswerReceivedEvent> {
  constructor(private guestService: GuestsService,private eventBus: EventBus) {
  }

  async handle(event: ValidAnswerReceivedEvent) {
    await this.guestService.notifyAboutValidAnswer(event.tId);
    await this.guestService.sendValidAnswerActions(event.tId);
    await this.guestService.updatePlayerScore(event.tId, 1);
    await this.guestService.changeWinningChance(event.tId, 30);
  }
}
