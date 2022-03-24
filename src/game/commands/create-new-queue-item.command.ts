import { GameQueueTypes } from '../../schemas/game-queue.schema';

export class CreateNewQueueItemCommand {
  constructor(public target: number, public type: GameQueueTypes) {
  }
}
