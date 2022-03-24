import { Context } from '../context.interface';
import { Messages } from './tg.text';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GlobalCommands {
  public printCommands(ctx: Context) {
    ctx.replyWithMarkdown('ты хочешь:', {
      reply_markup: {
        keyboard: [
          [{ text: Messages.CHANGE_PHOTO }],
          [{ text: Messages.NOTHING_THANKS }],
        ],
      },
    });
  }
  public hideKeyboard(ctx: Context) {
    ctx.replyWithMarkdown('-', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
}
