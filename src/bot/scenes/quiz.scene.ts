import { Command, Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { QUIZ_SCENE } from './scenes.const';
import { Context } from '../../context.interface';
import { QuizService } from '../../quiz/quiz.service';
import { GlobalCommands } from '../global-commands';
import { EventBus } from '@nestjs/cqrs';
import { QuizAnsweredEvent } from '../../game/events/quiz.answered';
import { Logger } from '@nestjs/common';
import { Messages } from '../tg.text';
import { getCard } from '../../helpers/card-parser';
import { PlayerCardSelectedEvent } from '../../game/events/player-card-selected.event';

@Scene(QUIZ_SCENE)
export class QuizScene {
  private readonly logger = new Logger(QuizScene.name);
  constructor(
    private quizService: QuizService,
    private globalCmd: GlobalCommands,
    private eventBus: EventBus,
  ) {}
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: Context, @Message('text') text: string) {
    if (ctx.session.__scenes.state.hasOwnProperty('answering')) {
      return this.onText(text, ctx);
    }
    ctx.reply(
      'Ответы на вопросы будут появляться туть, кто первый тот победил',
    );
  }

  @Command('leave')
  onLeaveScene(@Ctx() ctx: Context) {
    ctx.scene.leave();
  }

  @Command('start')
  onCommandStart(@Ctx() ctx: Context) {
    ctx.scene.leave();
    this.globalCmd.printCommands(ctx);
  }

  @On('text')
  async onText(@Message('text') text: string, @Ctx() ctx: Context) {
    if (text.includes(Messages.EMOJI_CARD)) {
      this.eventBus.publish(
        new PlayerCardSelectedEvent(ctx.message.from.id, getCard(text)),
      );
      return;
    }
    this.logger.verbose(`Answer from: ${ctx.message.from.first_name}`);
    this.logger.verbose(`Validating answer}`);
    this.eventBus.publish(new QuizAnsweredEvent());
    const result = await this.quizService.validateAnswer(
      text,
      ctx.message.from.id,
    );
    if (result) {
      ctx.replyWithMarkdown('Верно', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      return;
    }
    ctx.replyWithMarkdown('Ответ неверный', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }




}
