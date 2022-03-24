import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { GuestsService } from '../guests/guests.service';
import { ExtraPoll, ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Messages } from './tg.text';

@Injectable()
export class EchoService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private guestService: GuestsService,
  ) {}

  public async test(chatId: number) {
    await this.bot.telegram.sendMessage(chatId, 'test');
  }

  public async enterQuiz(chatId: number) {
    const extra: ExtraReplyMessage = {};
    await this.bot.telegram.sendMessage(chatId, '🥇 Да начнется битва!\n', {
      reply_markup: {
        keyboard: [[{ text: Messages.GO }]],
      },
    });
  }
}
