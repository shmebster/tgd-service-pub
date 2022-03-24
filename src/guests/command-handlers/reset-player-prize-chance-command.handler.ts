import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPlayerPrizeChanceCommand } from '../../game/commands/reset-player-prize-chance.command';
import { GuestsService } from '../guests.service';
import { Logger } from '@nestjs/common';
@CommandHandler(ResetPlayerPrizeChanceCommand)
export class GuestsResetPlayerPrizeChanceCommandHandler
  implements ICommandHandler<ResetPlayerPrizeChanceCommand> {
  private readonly logger = new Logger(
    GuestsResetPlayerPrizeChanceCommandHandler.name,
  );
  constructor(private guestService: GuestsService) {}
  async execute(command: ResetPlayerPrizeChanceCommand): Promise<any> {
    this.logger.verbose(`Reseting prize chance for ${command.telegramId}`);
    return this.guestService.changeWinningChance(command.telegramId, -100);
  }
}
