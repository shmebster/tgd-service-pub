import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizService } from '../quiz.service';
import { MarkQuestionsAsUnansweredCommand } from '../../game/commands/mark-questions-as-unanswered.command';
import { PenaltyService } from '../../penalty/penalty.service';

@CommandHandler(MarkQuestionsAsUnansweredCommand)
export class MarkQuestionsAsUnansweredCommandHandler
  implements ICommandHandler<MarkQuestionsAsUnansweredCommand>
{
  constructor(private quizService: QuizService, private penaltyService: PenaltyService) {}

  async execute(command: MarkQuestionsAsUnansweredCommand): Promise<any> {
    await this.quizService.markQuestionAsUnread();
    await this.penaltyService.resetPenalties();
  }
}
