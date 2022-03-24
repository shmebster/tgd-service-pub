import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CardSelectionPendingEvent } from '../events/card-selection-pending.event';
import { GameService } from '../game.service';

@EventsHandler(CardSelectionPendingEvent)
export class CardSelectionPendingEventHandler implements IEventHandler<CardSelectionPendingEvent> {
  constructor(private gameService: GameService) {}

  handle(event: CardSelectionPendingEvent): any {
    this.gameService.beginCardSelectionScene();
  }

}
