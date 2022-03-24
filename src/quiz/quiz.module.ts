import { forwardRef, Global, Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from '../schemas/question.schema';
import { GuestsModule } from '../guests/guests.module';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsStorageSchema, QuestionStorage } from '../schemas/question-storage.schema';
import { GameNextQuestionCommandHandler } from './command-handlers/next-question-command.handler';
import { MarkQuestionsAsUnansweredCommandHandler } from './command-handlers/mark-questions-as-unanswred-command.handler';
import { PenaltyModule } from '../penalty/penalty.module';
import { PenaltyService } from '../penalty/penalty.service';

const cmdHandlers = [
  GameNextQuestionCommandHandler,
  MarkQuestionsAsUnansweredCommandHandler,
];

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: QuestionStorage.name, schema: QuestionsStorageSchema },
    ]),
    forwardRef(() => GuestsModule),
    forwardRef(() => SharedModule),
    CqrsModule,
    PenaltyModule,
  ],
  controllers: [QuizController],
  exports: [QuizService],
  providers: [QuizService, ...cmdHandlers],
})
export class QuizModule {}
