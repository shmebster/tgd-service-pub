import { QuizAnswerStateEnum } from '../entities/quiz-answer-state.enum';
import { Logger } from '@nestjs/common';

export class QuizAnswerStateChangedEvent {
  private readonly logger = new Logger(QuizAnswerStateChangedEvent.name);
  constructor(public newState: QuizAnswerStateEnum, public telegramId: number) {
    this.logger.verbose(`New state is ${newState} by ${telegramId}`);
  }
}
