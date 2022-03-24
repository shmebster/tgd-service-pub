import { Body, Controller, Get, Post } from "@nestjs/common";
import { QuestionDto } from "./dto/question.dto";
import { QuizService } from "./quiz.service";
import { ExtraQuestionDto } from './dto/extra-question.dto';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {
  }
  @Get('')
  async get() {
    return await this.quizService.get();
  }
  @Post('')
  async set(@Body() qustionDto: QuestionDto) {
    return await this.quizService.setQuestion(qustionDto);
  }

  @Post('proceed')
  async Get() {
    return this.quizService.proceedWithGame();
  }

  @Post('questions')
  async postQuestion(@Body() questionDto: QuestionDto[]) {
    return await this.quizService.populateQuestions(questionDto);
  }

  @Post('extraquestion')
  async extraQuestion(@Body() extraQuestionDto: ExtraQuestionDto) {
    return this.quizService.playExtraQuestion(extraQuestionDto.telegramId);
  }

  @Post('import')
  async importQuestion(@Body() questions: QuestionDto[]) {
    return this.quizService.importQuestions(questions);
  }

  @Post('deal-prize')
  async dealPrize() {
    return this.quizService.dealPrize();
  }
}
