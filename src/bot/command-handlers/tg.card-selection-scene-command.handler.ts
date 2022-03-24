import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CardSelectionTimeExceedCommand } from '../../game/commands/card-selection-time-exceed.command';
import { Timeout } from '@nestjs/schedule';
import { TGD_Config } from '../../../app.config';
import { Logger } from '@nestjs/common';
import { HideKeyboardCommand } from '../../game/commands/hide-keyboard.command';

@CommandHandler(CardSelectionTimeExceedCommand)
export class TgCardSelectionSceneCommandHandler implements ICommandHandler<CardSelectionTimeExceedCommand> {
  private logger = new Logger(TgCardSelectionSceneCommandHandler.name);
  constructor(private cmdBus: CommandBus) {
  }
  execute(command: CardSelectionTimeExceedCommand): Promise<any> {
    this.logger.verbose(`Timeout of selecting cards`);
    return this.cmdBus.execute(
      new HideKeyboardCommand('Время выбора карты истекло'),
    );
    return Promise.resolve(undefined);
  }

}
