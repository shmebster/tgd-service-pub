import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GiveCardsCommand } from '../commands/give-cards.command';
import { GuestsService } from '../../guests/guests.service';
@CommandHandler(GiveCardsCommand)
export class GiveCardsCommandHandler
  implements ICommandHandler<GiveCardsCommand>
{
  constructor(private guestService: GuestsService) {}
  async execute(command: GiveCardsCommand) {
    await this.guestService.giveCards();
  }
}
