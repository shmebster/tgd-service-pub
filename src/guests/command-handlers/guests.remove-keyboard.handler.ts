import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HideKeyboardCommand } from '../../game/commands/hide-keyboard.command';
import { GuestsService } from '../guests.service';

@CommandHandler(HideKeyboardCommand)
export class GuestsRemoveKeyboardHandler implements ICommandHandler<HideKeyboardCommand> {
  constructor(private guestService: GuestsService) {
  }
  async execute(cmd: HideKeyboardCommand) {
    await this.guestService.hideKeyboard(cmd.message);
  }
}
