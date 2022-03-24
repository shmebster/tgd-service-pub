import {
  Command,
  Ctx,
  Hears,
  Start,
  Update,
  Sender,
  Help,
  On, Message,
} from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { Context } from '../context.interface';
import { GuestsService } from '../guests/guests.service';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Markup } from 'telegraf';
import {
  QUIZ_SCENE,
  REGISTER_PHOTO_SCENE,
  REGISTER_SCENE_ID,
} from './scenes/scenes.const';
import { Messages } from './tg.text';
import { GlobalCommands } from './global-commands';

@Update()
export class BotUpdate {
  readonly numbers = Messages.answerNumbers;
  constructor(
    private guestService: GuestsService,
    private globalCmd: GlobalCommands,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const result = await this.guestService.findById(ctx.from.id);
    if (result) {
      await ctx.reply(
        `🤟 Все путем, ты уже зарегистрирован, расслабься и жди указаний\r\nМожет быть`,
      );
      this.globalCmd.printCommands(ctx);
      return;
    }
    let reply = `👋 Привет, ${ctx.message.from.first_name}!\r\n`;
    reply +=
      'Я не вижу тебя в списке зарегистрированных участников, пройдем регистрацию?';
    await ctx.replyWithMarkdown(reply, {
      reply_markup: {
        keyboard: [[{ text: Messages.IM_IN }]],
      },
    });
  }

  @Help()
  async helpCommand(@Ctx() ctx: Context) {
    await ctx.reply('no-help-cmd');
  }

  @On('sticker')
  async onSticker(@Ctx() ctx: Context) {
    console.log(ctx.message.from);
    await ctx.reply('👍');
  }

  @Hears(Messages.IM_IN)
  async onRegisterCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(REGISTER_SCENE_ID);
  }
  @Hears(Messages.GO)
  async onGoCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter(QUIZ_SCENE);
  }

  @Command('photo')
  async onPhotoCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter(REGISTER_PHOTO_SCENE);
  }

  @Hears(Messages.CHANGE_PHOTO)
  onChangePhoto(@Ctx() ctx: Context) {
    ctx.scene.enter(REGISTER_PHOTO_SCENE);
  }

  @On('text')
  async onMsg(@Message('text') msg: string, @Ctx() ctx: Context) {
    const chars = [...msg];
    if (['1', '2', '3', '4'].includes(chars[0])) {
      ctx.scene.enter(QUIZ_SCENE, { answering: true }, false);
    }
    if (msg.includes(Messages.EMOJI_CARD)) {
      ctx.scene.enter(QUIZ_SCENE, { answering: true}, false);
    }
  }


}
