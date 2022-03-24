import { GameCard } from '../entities/cards.entities';

export class RemoveCardFromUserCommand {
  constructor(public telegramId: number, public card: GameCard) {
  }
}
