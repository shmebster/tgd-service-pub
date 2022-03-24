import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StateService } from '../state/state.service';
import { CommandBus } from '@nestjs/cqrs';
import { GiftsService } from 'src/gifts/gifts.service';
import { QuizService } from 'src/quiz/quiz.service';
import { SharedService } from 'src/shared/shared.service';
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  private state;

  constructor(
    private stateService: StateService,
    private cmdBus: CommandBus,
    private giftsService: GiftsService,
    private quizService: QuizService,
    private sharedService: SharedService,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    await this.updateState();
  }

  private async updateState() {
    this.state = (await this.stateService.getState('main')).value;
    this.logger.verbose(`Game state is: ${this.state}`);
  }
  @Cron('* * * * *')
  async gameStatus() {
    const giftsLeft = await this.giftsService.getRemainingPrizeCount();
    if (giftsLeft === 0) {
      const state = await this.stateService.setState('main', 'finish');
      this.sharedService.sendSocketNotificationToAllClients(
        'state_changed',
        state,
      );
      this.logger.warn(`Gifts is ended, finishing game`);
    }
    const questionsLeft = await this.quizService.getRemainQuestionCount();
    this.logger.verbose(
      `Gifts left ${giftsLeft}, Questions without answer: ${questionsLeft}`,
    );
  }
}
