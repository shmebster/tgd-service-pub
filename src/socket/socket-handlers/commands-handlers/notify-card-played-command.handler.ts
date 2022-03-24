import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyCardOnScreenCommand } from '../../../game/commands/notify-card-on-screen-command';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';
import { Logger } from '@nestjs/common';

@CommandHandler(NotifyCardOnScreenCommand)
export class NotifyCardPlayedCommandHandler
  implements ICommandHandler<NotifyCardOnScreenCommand> {
  private logger = new Logger(NotifyCardPlayedCommandHandler.name);
  constructor(private sharedService: SharedService) {
  }
  async execute(command: NotifyCardOnScreenCommand): Promise<any> {
    this.logger.log(`Notify about card`);
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.CARD_PLAYED, {
      telegramId: command.telegramId,
      card: command.card.description,
      name: command.card.name,
    });
    return true;
  }
}
