import { REGISTER_NAME_PROMPT_SCENE, REGISTER_PHOTO_SCENE, REGISTER_SCENE_ID } from "./scenes.const";
import {
  Command,
  Ctx,
  Hears,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { Markup } from 'telegraf';
import { Messages } from '../tg.text';
import { GuestsService } from '../../guests/guests.service';
@Scene(REGISTER_SCENE_ID)
export class RegisterScene {
  constructor(private guestService: GuestsService) {}
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: Context) {
    const reply = `Шалом-шалом ✋\r\n
Я могу тебя звать ${ctx.message.from.first_name}?
    `;
    ctx.reply(
      reply,
      Markup.keyboard([
        Markup.button.text(Messages.THATS_ME),
        Markup.button.text(Messages.NOT_ME),
      ]),
    );
  }

  @Hears(Messages.THATS_ME)
  async onAgree(@Ctx() ctx: Context) {
    const user = await this.guestService.create({
      name: ctx.message.from.first_name,
      telegramId: ctx.message.from.id,
      chatId: ctx.chat.id,
    });
    ctx.replyWithMarkdown('Охуенчик, добро пожаловать!', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    ctx.scene.enter(REGISTER_PHOTO_SCENE);
  }

  @Hears(Messages.NOT_ME)
  onDisagree(@Ctx() ctx: Context) {
    ctx.replyWithMarkdown('Тогда назови себя', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    ctx.scene.enter(REGISTER_NAME_PROMPT_SCENE);
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
