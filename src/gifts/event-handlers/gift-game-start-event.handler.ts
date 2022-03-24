import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameStartedEvent } from '../../game/events/game-started.event';
import { GiftsService } from '../gifts.service';

@EventsHandler(GameStartedEvent)
export class GiftGameStartEventHandler implements IEventHandler<GameStartedEvent> {
  constructor(private giftsService: GiftsService) {
  }
  async handle(e: GameStartedEvent) {
    await this.giftsService.markAllAsUngifted();
  }
}
