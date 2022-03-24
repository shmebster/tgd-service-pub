import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WrongAnswerReceivedEvent } from '../events/wrong-answer-received.event';
import { GameService } from '../game.service';
import { GameQueueTypes } from '../../schemas/game-queue.schema';

@EventsHandler(WrongAnswerReceivedEvent)
export class GameWrongAnswerReceivedEventHandler
  implements IEventHandler<WrongAnswerReceivedEvent> {
  constructor(private gameService: GameService) {
  }

  async handle(event: WrongAnswerReceivedEvent) {
    await this.gameService.addTaskToGameQueue(
      event.tId,
      GameQueueTypes.penalty,
    );
  }
}
