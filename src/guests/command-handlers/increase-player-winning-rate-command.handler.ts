import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GuestsService } from '../guests.service';
import { Logger } from '@nestjs/common';
import { IncreasePlayerWinningRateCommand } from '../../game/commands/increase-player-winning-rate.command';

@CommandHandler(IncreasePlayerWinningRateCommand)
export class IncreasePlayerWinningRateCommandHandler implements ICommandHandler<IncreasePlayerWinningRateCommand> {
  private readonly logger = new Logger(
    IncreasePlayerWinningRateCommandHandler.name,
  );
  constructor(private guestService: GuestsService) {
  }
  async execute(command: IncreasePlayerWinningRateCommand): Promise<any> {
    this.logger.verbose(`Increase for ${command.tId} for ${command.rate}`);
    await this.guestService.changeWinningChance(command.tId, command.rate);
  }

}
