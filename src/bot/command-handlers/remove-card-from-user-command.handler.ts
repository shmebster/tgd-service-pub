import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCardFromUserCommand } from '../../game/commands/remove-card-from-user.command';
import { GuestsService } from '../../guests/guests.service';
import { SharedService } from '../../shared/shared.service';
import { PostCardsToUserCommand } from '../../game/commands/post-cards-to-user.command';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Messages } from '../tg.text';

@CommandHandler(RemoveCardFromUserCommand)
export class RemoveCardFromUserCommandHandler implements ICommandHandler<RemoveCardFromUserCommand> {
  constructor(
    @InjectBot() private bot: Telegraf,
    private guestService: GuestsService,
    private sharedService: SharedService,
    private cmdBus: CommandBus,
  ) {
  }

  async execute(command: RemoveCardFromUserCommand): Promise<any> {
    const guest = await this.guestService.findById(command.telegramId);
    const data = await this.sharedService.getConfig(`buttons_${command.telegramId}`);
    const extra = {
      reply_markup: {
        remove_keyboard: false,
        keyboard: [],
      },
    };
    const buttons = JSON.parse(data.value);
    let found = false;
    buttons.reply_markup.keyboard.forEach((item) => {
      if (item[0].text.includes(command.card.description) && !found) {
        found = true;
      } else {
        extra.reply_markup.keyboard.push(
          [ { ...item[0] } ]
        )
      }
    });
    if (extra.reply_markup.keyboard.length === 0) {
      extra.reply_markup.remove_keyboard = true;
    }
    await this.sharedService.setConfig(`buttons_${command.telegramId}`, JSON.stringify(extra));
    await this.bot.telegram.sendMessage(
      guest.chatId,
      Messages.SELECT_CARD,
      extra,
    );
  }
}
