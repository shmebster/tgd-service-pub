import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrepareGameEvent } from '../../game/events/prepare-game.event';
import { GuestsService } from '../guests.service';
import { QuizService } from '../../quiz/quiz.service';

@EventsHandler(PrepareGameEvent)
export class GuestsPrepareGameEventHandler implements  IEventHandler<PrepareGameEvent> {
  private readonly logger = new Logger(GuestsPrepareGameEventHandler.name);

  constructor(
    private guestService: GuestsService,
    private quizService: QuizService,
  ) {}

  async handle(event: PrepareGameEvent): Promise<any> {
    this.logger.verbose(`Prepare game event`);
    await this.guestService.dealCards();
    await this.guestService.resetPlayersScore();
  }

}
