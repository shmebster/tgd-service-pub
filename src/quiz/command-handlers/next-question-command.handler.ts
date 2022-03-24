import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NextQuestionCommand } from '../../game/commands/next-question.command';
import { QuizService } from '../quiz.service';
import { GiveCardsCommand } from '../../game/commands/give-cards.command';

@CommandHandler(NextQuestionCommand)
export class GameNextQuestionCommandHandler
  implements ICommandHandler<NextQuestionCommand> {
  constructor(private quizService: QuizService, private cmdBus: CommandBus) {
  }
  async execute(command: NextQuestionCommand): Promise<any> {
    await this.cmdBus.execute(new GiveCardsCommand());
    await this.quizService.playNextQuestion();
  }
}
