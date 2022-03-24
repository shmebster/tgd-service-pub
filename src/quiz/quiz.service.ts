import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from '../schemas/question.schema';
import { QuestionDto } from './dto/question.dto';
import { GuestsService } from '../guests/guests.service';
import { SharedService } from '../shared/shared.service';
import { Messages } from '../bot/tg.text';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ValidAnswerReceivedEvent } from '../game/events/valid-answer.recieved';
import {
  QuestionStorage,
  QuestionStorageDocument,
} from '../schemas/question-storage.schema';
import { WrongAnswerReceivedEvent } from '../game/events/wrong-answer-received.event';
import { ProceedGameQueueCommand } from '../game/commands/proceed-game-queue.command';
import { getRandomInt } from 'src/helpers/rand-number';

@Injectable({ scope: Scope.TRANSIENT })
export class QuizService {
  private readonly answerNumbers = Messages.answerNumbers;
  private readonly logger = new Logger(QuizService.name);
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(QuestionStorage.name)
    private questionStorageModel: Model<QuestionStorageDocument>,
    private guestService: GuestsService,
    private sharedService: SharedService,
    private eventBus: EventBus,
    private commandBus: CommandBus,
  ) {}

  async get(): Promise<QuestionDocument> {
    return this.questionModel.find().sort({ _id: -1 }).findOne();
  }

  async setQuestion(questionDto: QuestionDto, target: number = null) {
    const item = new this.questionModel(questionDto);
    await item.save();
    this.logger.verbose(`Question updated`);
    await this.guestService.postQuestion(questionDto, target);
    this.sharedService.sendSocketNotificationToAllClients(
      'question_changed',
      questionDto,
    );
    return item.save();
  }

  async validateAnswer(answer: string, id: number) {
    this.logger.verbose(`enter validate answer ${answer} ${id}`);
    const question = await this.get();
    if (question.answered) {
      this.logger.verbose(`Question already answered`);
      return false;
    }
    question.answered = true;
    await question.save();
    const regexp = new RegExp(
      Object.keys(this.answerNumbers)
        .map((x) => {
          x = this.answerNumbers[x].replace('.', '.').replace(' ', ' ');
          return x;
        })
        .join('|'),
      'gi',
    );
    this.logger.verbose(
      `Validating answer for question: ${JSON.stringify(question.text)}`,
    );
    const filtered = answer.replace(regexp, '').trim();
    if (question.valid === filtered) {
      question.answered = true;
      question.answeredBy = id;
      this.eventBus.publish(new ValidAnswerReceivedEvent(id, filtered));
      await question.save();
      this.markQuestionStorageAsAnsweredCorrectly(question.text);
      return true;
    }
    this.eventBus.publish(new WrongAnswerReceivedEvent(id, question.valid));
    return false;
  }

  async markQuestionStorageAsAnsweredCorrectly(questionText: string) {
    this.logger.verbose(
      `Marking question ${questionText} is answered correctly`,
    );
    const question = await this.questionStorageModel
      .findOne({ text: questionText })
      .exec();
    question.isAnsweredCorrectly = true;
    await question.save();
  }

  async populateQuestions(questionDto: QuestionDto[]) {
    for (const item of questionDto) {
      const newItem = new this.questionStorageModel({
        ...item,
      });
      await newItem.save();
    }
  }

  async proceedWithGame() {
    this.logger.verbose(`[proceedWithGame] Executing proceed with game`);
    await this.commandBus.execute(new ProceedGameQueueCommand());
    return Promise.resolve(true);
  }

  private async getNextQuestion() {
    let question = await this.questionStorageModel
      .findOne({ isAnswered: false })
      .exec();
    if (!question) {
      const unanswered = await this.getRemainQuestionWithouValidAnswer();
      const skipRand = getRandomInt(0, unanswered);
      question = await this.questionStorageModel
        .findOne({ isAnsweredCorrectly: false })
        .skip(skipRand)
        .exec();
    }
    return question;
  }

  async playNextQuestion() {
    this.logger.verbose(`Playing next question`);
    const question = await this.getNextQuestion();
    question.isAnswered = true;
    await this.setQuestion({
      text: question.text,
      answers: question.answers,
      valid: question.valid,
    });
    await question.save();
  }

  async playExtraQuestion(telegramId: number) {
    const question = await this.getNextQuestion();
    this.logger.verbose(`playExtraQuestion: ${question.text}`);
    await this.setQuestion(
      { text: question.text, answers: question.answers, valid: question.valid },
      telegramId,
    );
    question.isAnswered = true;
    await question.save();
    return question;
  }

  async markQuestionAsUnread() {
    this.logger.verbose(`markQuestionAsUnread: enter`);
    await this.questionStorageModel
      .updateMany({}, { isAnswered: false })
      .exec();
    this.logger.verbose(`markQuestionAsUnread: done`);
  }

  async getRemainQuestionCount(): Promise<number> {
    const questions = await this.questionStorageModel
      .find({ isAnswered: false })
      .exec();
    return questions.length;
  }

  async getRemainQuestionWithouValidAnswer(): Promise<number> {
    const questions = await this.questionStorageModel.find({
      isAnsweredCorrectly: false,
    });
    return questions.length;
  }

  async importQuestions(questions: QuestionDto[]) {
    await this.questionStorageModel.deleteMany({}).exec();
    for (const item of questions) {
      const newQuestion = new this.questionStorageModel({
        text: item.text,
        valid: item.valid,
        answers: item.answers,
        isAnswered: false,
      });
      await newQuestion.save();
    }
    return true;
  }

  dealPrize() {
    return Promise.resolve(undefined);
  }
}
