import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrepareGameEvent } from '../events/prepare-game.event';
import { GameService } from '../game.service';
import { MarkQuestionsAsUnansweredCommand } from '../commands/mark-questions-as-unanswered.command';

@EventsHandler(PrepareGameEvent)
export class GamePrepareGameEventHandler
  implements IEventHandler<PrepareGameEvent> {
  constructor(private gameService: GameService, private cmdBus: CommandBus) {
  }
  async handle(event: PrepareGameEvent) {
    await this.gameService.cleanGameQueue();
    await this.cmdBus.execute(new MarkQuestionsAsUnansweredCommand());
  }

}
