import { GameCard } from '../entities/cards.entities';

export class PlayerCardSelectedEvent {
  constructor(public telegramId: number, public card: GameCard) {
  }
}
