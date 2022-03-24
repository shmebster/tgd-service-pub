import { REGISTER_NAME_PROMPT_SCENE, REGISTER_PHOTO_SCENE } from "./scenes.const";
import { Command, Ctx, Hears, On, Scene, SceneEnter, SceneLeave } from "nestjs-telegraf";
import { Context } from '../../context.interface';
import { GuestsService } from '../../guests/guests.service';
@Scene(REGISTER_NAME_PROMPT_SCENE)
export class RegisterNamePrompt {
  constructor(private guestService: GuestsService) {
  }
  @On('message')
  async onMessage(@Ctx() ctx: Context) {
    const name = (<any>ctx.message).text;
    await this.guestService.create({
      name: name,
      telegramId: ctx.message.from.id,
      chatId: ctx.message.chat.id,
    });
    ctx.reply(`Приятно познакомиться, ${name}!`);
    ctx.scene.enter(REGISTER_PHOTO_SCENE);
  }

  @SceneLeave()
  sceneLeave(@Ctx() ctx: Context)
  {
    ctx.scene.leave();
  }
}
