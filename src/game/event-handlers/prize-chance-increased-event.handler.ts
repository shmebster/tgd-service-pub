import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrizeChangeIncreasedEvent } from '../events/prize-change-increased.event';
import { ResetPlayerPrizeChanceCommand } from '../commands/reset-player-prize-chance.command';
import { Logger } from '@nestjs/common';
import { GiveOutAPrizeCommand } from '../commands/give-out-a-prize.command';
@EventsHandler(PrizeChangeIncreasedEvent)
export class GamePrizeChanceIncreasedEventHandler
  implements IEventHandler<PrizeChangeIncreasedEvent> {

  private readonly logger = new Logger(
    GamePrizeChanceIncreasedEventHandler.name,
  );

  constructor(private cmdBus: CommandBus) {
  }

  async handle(event: PrizeChangeIncreasedEvent) {
    this.logger.verbose(`Chance for player ${event.telegramId} changed and now its: ${event.newChance}`);
    if (event.newChance > 100) {
      await this.cmdBus.execute(
        new ResetPlayerPrizeChanceCommand(event.telegramId),
      );
      await this.cmdBus.execute(new GiveOutAPrizeCommand(event.telegramId));
    }
  }

}
