import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../../game/events/user-registered.event';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(private sharedService: SharedService) {
  }
  handle(event: UserRegisteredEvent): any {
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.USER_ADDED,
      {
        telegramId: event.telegramId,
        name: event.name,
    });
  }
}
