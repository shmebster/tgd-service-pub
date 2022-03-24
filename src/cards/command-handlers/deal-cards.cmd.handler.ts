import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DealCardsCommand } from '../../game/commands/deal-cards.command';
import { CardsService } from '../cards.service';
import { Logger } from '@nestjs/common';

@CommandHandler(DealCardsCommand)
export class DealCardsCmdHandler implements ICommandHandler<DealCardsCommand> {
  private readonly logger = new Logger(DealCardsCmdHandler.name);
  constructor(private cardsService: CardsService) {
  }
  execute(command: DealCardsCommand): Promise<any> {
    this.logger.verbose(`Dealing cards for user ${command.telegramId}`);
    return this.cardsService.dealStartCards(command.telegramId);
  }
}
