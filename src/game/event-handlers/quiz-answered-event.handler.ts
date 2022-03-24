import { CommandBus, EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HideKeyboardCommand } from '../commands/hide-keyboard.command';
import { QuizAnsweredEvent } from '../events/quiz.answered';

@EventsHandler(QuizAnsweredEvent)
export class QuizAnsweredEventHandler
  implements IEventHandler<QuizAnsweredEvent>
{
  constructor(private eventBus: EventBus, private commandBus: CommandBus) {
  }

  async handle(event: QuizAnsweredEvent) {
    await this.commandBus.execute(new HideKeyboardCommand('вопрос отвечен'));
  }
}
