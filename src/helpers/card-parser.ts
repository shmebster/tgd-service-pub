import { GameCard, gameCards } from '../game/entities/cards.entities';
import { Messages } from '../bot/tg.text';
export function getCard(text: string) {
  const array: GameCard[] = [];
  gameCards.forEach((card) => {
    const c = new card();
    array.push(c);
    text = text.replace(c.getEmoji(), '');
  });
  text = text.replace(Messages.EMOJI_CARD, '');
  text = text.trim();
  return array.find((x) => x.description === text);
}
