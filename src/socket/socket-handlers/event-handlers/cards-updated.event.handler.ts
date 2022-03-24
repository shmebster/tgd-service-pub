import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CardsDealedEvent } from '../../../game/events/cards-dealed.event';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';

@EventsHandler(CardsDealedEvent)
export class CardsUpdatedEventHandler implements IEventHandler<CardsDealedEvent> {
  constructor(private sharedService: SharedService) {
  }
  handle(event: CardsDealedEvent): any {
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.CARDS_CHANGED_EVENT,
      {
        telegramId: event.telegramId,
        cards: event.cards,
    });
  }
}
