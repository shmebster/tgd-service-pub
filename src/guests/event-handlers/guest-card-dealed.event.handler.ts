import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CardsDealedEvent } from '../../game/events/cards-dealed.event';
import { GuestsService } from '../guests.service';

@EventsHandler(CardsDealedEvent)
export class GuestCardDealedEventHandler implements IEventHandler<CardsDealedEvent> {
  constructor(private guestService: GuestsService) {
  }
  handle(event: CardsDealedEvent): any {
    this.guestService.sendDealedCards(event.telegramId, event.cardsTypes);
  }

}
