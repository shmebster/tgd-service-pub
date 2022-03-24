import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendToastCommand } from '../../../game/commands/send-toast.command';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';

@CommandHandler(SendToastCommand)
export class SendToastCommandHandler implements ICommandHandler<SendToastCommand> {
  constructor(private sharedService: SharedService) {
  }
  async execute(command: SendToastCommand) {
    await this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.NOTIFICATION,
      {
        text: command.text,
        timeout: command.timeout,
      },
    );
  }
}
