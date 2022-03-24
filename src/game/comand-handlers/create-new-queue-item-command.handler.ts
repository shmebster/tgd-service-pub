import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewQueueItemCommand } from '../commands/create-new-queue-item.command';
import { GameService } from '../game.service';

@CommandHandler(CreateNewQueueItemCommand)
export class CreateNewQueueItemCommandHandler implements ICommandHandler<CreateNewQueueItemCommand> {
  constructor(
    private gameService: GameService,
  ) {
  }

  async execute(command: CreateNewQueueItemCommand): Promise<any> {
    await this.gameService.addTaskToGameQueue(command.target, command.type);
    return Promise.resolve(undefined);
  }

}
