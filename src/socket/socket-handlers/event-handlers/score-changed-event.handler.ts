import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ScoreChangedEvent } from '../../../game/events/score-changed.event';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';

@EventsHandler(ScoreChangedEvent)
export class SocketScoreChangedEventHandler
  implements IEventHandler<ScoreChangedEvent> {
  constructor(private sharedService: SharedService) {
  }
  async handle(event: ScoreChangedEvent) {
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.SCORE_CHANGED,
      {
        telegramId: event.telegramId,
        newScore: event.newScore,
      },
    );
  }
}
