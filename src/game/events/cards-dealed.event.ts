import { GameCard } from '../entities/cards.entities';

export class CardsDealedEvent {
  constructor(
    public telegramId: number,
    public cards: string[],
    public cardsTypes: GameCard[],
  ) {}
}
