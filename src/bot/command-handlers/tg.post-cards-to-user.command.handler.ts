import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCardsToUserCommand } from '../../game/commands/post-cards-to-user.command';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Messages } from '../tg.text';
import { SharedService } from '../../shared/shared.service';

@CommandHandler(PostCardsToUserCommand)
export class TgPostCardsToUserCommandHandler implements ICommandHandler<PostCardsToUserCommand> {
  constructor(
    @InjectBot() private bot: Telegraf,
    private sharedService: SharedService,
  ) {}


  async execute(command: PostCardsToUserCommand): Promise<any> {
    const extra = {
      reply_markup: {
        keyboard: [],
      },
    };
    if (command.cards.length === 0) {
      return;
    }
    command.cards.forEach((card) => {
      extra.reply_markup.keyboard.push([
        { text: Messages.EMOJI_CARD + ' ' + card },
      ]);
    });
    await this.sharedService.setConfig(`buttons_${command.chatId}`,
      JSON.stringify(extra),
    );
    return this.bot.telegram.sendMessage(
      command.chatId,
      Messages.SELECT_CARD,
      extra,
    );
  }

}
