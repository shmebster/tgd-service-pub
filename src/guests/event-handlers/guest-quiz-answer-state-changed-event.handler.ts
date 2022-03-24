import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QuizAnswerStateChangedEvent } from '../../game/events/quiz-answer-state-changed.event';
import { QuizAnswerStateEnum } from '../../game/entities/quiz-answer-state.enum';
import { GuestsService } from '../guests.service';

@EventsHandler(QuizAnswerStateChangedEvent)
export class GuestQuizAnswerStateChangedEventHandler
  implements IEventHandler<QuizAnswerStateChangedEvent>
{
  constructor(private guestService: GuestsService) {
  }
  async handle(event: QuizAnswerStateChangedEvent) {
    if (event.newState === QuizAnswerStateEnum.playerGettingReward) {
      await this.guestService.sendRewardActions(event.telegramId);
    }
    if (event.newState === QuizAnswerStateEnum.playerGotPenalty) {
      await this.guestService.sendPenaltyActions(event.telegramId);
    }
  }

}
