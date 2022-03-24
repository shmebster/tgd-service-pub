import {
  CommandBus,
  EventBus,
  EventsHandler,
  IEventHandler,
} from '@nestjs/cqrs';
import { PlayerCardSelectedEvent } from '../events/player-card-selected.event';
import { Logger } from '@nestjs/common';
import { GameService } from '../game.service';
import { QuizService } from '../../quiz/quiz.service';
import { CardsService } from '../../cards/cards.service';
import { RemoveCardFromUserCommand } from '../commands/remove-card-from-user.command';
import { CardsSetChangedEvent } from '../events/cards-events/cards-set-changed.event';

@EventsHandler(PlayerCardSelectedEvent)
export class PlayerCardSelectedEventHandler implements IEventHandler<PlayerCardSelectedEvent>{
  private readonly logger = new Logger(PlayerCardSelectedEventHandler.name);
  constructor(
    private cmdBus: CommandBus,
    private eventBus: EventBus,
    private gameService: GameService,
    private quizService: QuizService,
    private cardService: CardsService,
  ) {}
  async handle(event: PlayerCardSelectedEvent): Promise<any> {
    this.logger.verbose(
      `Handling card selected by ${event.telegramId} `,
      JSON.stringify(event.card),
    );
    const question = await this.quizService.get();
    event.card.setup(
      this.eventBus,
      this.cmdBus,
      event.telegramId,
      question.answeredBy,
    );
    try {
      await this.cmdBus.execute(
        new RemoveCardFromUserCommand(event.telegramId, event.card),
      );
      await this.cardService.markCardAsUsed(event.telegramId, event.card);
      await this.eventBus.publish(new CardsSetChangedEvent(event.telegramId));
      await event.card.handle();
      return true;
    } catch (e) {
      return false;
    }
  }
}
