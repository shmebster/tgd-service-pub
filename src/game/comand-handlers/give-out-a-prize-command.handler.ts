import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GiveOutAPrizeCommand } from '../commands/give-out-a-prize.command';
import { GameService } from '../game.service';
import { Logger } from '@nestjs/common';
import { GameQueueTypes } from '../../schemas/game-queue.schema';

@CommandHandler(GiveOutAPrizeCommand)
export class GameGiveOutAPrizeCommandHandler
  implements ICommandHandler<GiveOutAPrizeCommand> {

  private readonly logger = new Logger(GameGiveOutAPrizeCommandHandler.name);

  constructor(private gameService: GameService) {
  }

  async execute(command: GiveOutAPrizeCommand): Promise<any> {
    this.logger.verbose(`Player winning a prize ${command.telegramId}`);
    return this.gameService.addTaskToGameQueue(
      command.telegramId,
      GameQueueTypes.giveOutAPrize,
    );
  }
}
