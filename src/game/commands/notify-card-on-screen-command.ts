import { GameCard } from '../entities/cards.entities';

export class NotifyCardOnScreenCommand {
  constructor(public telegramId: number, public card: GameCard) {
  }
}
