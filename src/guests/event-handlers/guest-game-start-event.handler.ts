import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameStartedEvent } from '../../game/events/game-started.event';
import { GuestsService } from '../guests.service';
import { Logger } from '@nestjs/common';
import { QuizService } from '../../quiz/quiz.service';
import { NextQuestionCommand } from '../../game/commands/next-question.command';

@EventsHandler(GameStartedEvent)
export class GuestGameStartEventHandler implements IEventHandler<GameStartedEvent> {
  private logger = new Logger(GuestsService.name);
  constructor(
    private guestService: GuestsService,
    private cmdBus: CommandBus,
  ) {}

  async handle(event: GameStartedEvent) {
    this.logger.verbose(`Handling game start`);
    await this.guestService.resetPlayersScore();
    await this.guestService.resetWinningChance();
    this.logger.verbose(`Score cleaned`);
    await this.cmdBus.execute(new NextQuestionCommand());
  }
}
