import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from '../schemas/cards.schema';
import { Model } from 'mongoose';
import { gameCards, GameCard } from '../game/entities/cards.entities';
import { EventBus } from '@nestjs/cqrs';
import { CardsDealedEvent } from '../game/events/cards-dealed.event';
import { QuizAnswerStateEnum } from '../game/entities/quiz-answer-state.enum';
import { CardsSetChangedEvent } from '../game/events/cards-events/cards-set-changed.event';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);
  private readonly gameCards = gameCards;
  private playerCards = [];
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private eventBus: EventBus,
  ) {
    for (const card of gameCards) {
      const nCard = new card();
      this.playerCards.push(nCard);
    }
  }

  getCards(telegramId: number) {
    return this.cardModel.find({ telegramId, used: false }).exec();
  }

  calculateTotal(playerCards: GameCard[]): number {
    let total = 0;
    for (let i = 0; i < playerCards.length; ++i) {
      total += playerCards[i].chance;
    }
    return total;
  }

  getRandomCard(totalWeigh: number, playerCards: GameCard[]) {
    const thrshold = Math.random() * totalWeigh;
    let total = 0;
    for (let i = 0; i < playerCards.length; i++) {
      total += playerCards[i].chance;
      if (total >= thrshold) {
        return playerCards[i];
      }
    }
  }

  async markCardAsUsed(telegramId: number, card: GameCard) {
    this.logger.log(`checking that card is still aplicable `);
    const cardItem = await this.cardModel
      .findOne({ telegramId, cardType: card.name, used: false })
      .exec();
    if (!cardItem) {
      this.logger.log(`card already being used`);
      throw new InternalServerErrorException('Card already used');
    }
    cardItem.used = true;
    await cardItem.save();
    return cardItem;
  }

  async withdrawNewCard(telegramId: number) {
    this.logger.verbose(`generating card for player ${telegramId}`);
    const card = this.getRandomCard(
      this.calculateTotal(this.playerCards),
      this.playerCards,
    );
    this.logger.verbose(card);
    const cardItem = new this.cardModel({
      telegramId,
      cardName: card.description,
      cardType: card.name,
      emoji: card.getEmoji(),
      mightBePlayed: card.mightBePlayed,
    });
    await cardItem.save();
    this.eventBus.publish(new CardsSetChangedEvent(telegramId));
    return card;
  }


  async dealStartCards(telegramId: number) {
    const cards = await this.cardModel.find({ telegramId }).exec();
    for(const card of cards) {
      this.logger.verbose(
        `Deleting card ${card.cardType} for player ${telegramId}`,
      );
      await card.remove();
    }

    const starterCard = this.playerCards.filter((x) => x.dealOnStart === true);
    const rndCards: GameCard[] = [...starterCard];
    const weight = this.calculateTotal(this.playerCards);
    for (let i = 0; i < 3; i++) {
      rndCards.push(this.getRandomCard(weight, this.playerCards));
    }
    this.logger.verbose(`Dealed for ${telegramId}, ${rndCards.map((x) => x.name).join(',')}`);
    for (const rcard of rndCards) {
      const dbCard = new this.cardModel({
        telegramId,
        cardName: rcard.description,
        cardType: rcard.name,
        emoji: rcard.getEmoji(),
        mightBePlayed: rcard.mightBePlayed,
      });
      await dbCard.save();
    }
    this.eventBus.publish(
      new CardsDealedEvent(
        telegramId,
        rndCards.map((c) => c.description),
        rndCards,
      ),
    );
  }

  async getCardsForState(
    telegramId: number,
    quizState: QuizAnswerStateEnum,
  ) {
    this.logger.verbose(`Finding cards for ${telegramId}, ${quizState}`);
    return await this.cardModel.find({ telegramId, mightBePlayed: quizState, used: false }).exec();
  }
}
