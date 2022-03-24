import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CardsSetChangedEvent } from '../../../game/events/cards-events/cards-set-changed.event';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';

@EventsHandler(CardsSetChangedEvent)
export class CardsSetChangedEventHandler
  implements IEventHandler<CardsSetChangedEvent>
{
  constructor(private sharedService: SharedService) {}
  handle(event: CardsSetChangedEvent): any {
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.CARDS_CHANGED_EVENT,
      { telegramId: event.telegramId },
    );
  }
}
