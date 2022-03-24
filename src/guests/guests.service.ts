import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guest, GuestDocument } from '../schemas/guest.schema';
import { Model } from 'mongoose';
import { CreateGuestDto } from './dto/create-guest.dto';
import { QuestionDto } from '../quiz/dto/question.dto';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Messages } from '../bot/tg.text';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../game/events/user-registered.event';
import { DealCardsCommand } from '../game/commands/deal-cards.command';
import { GameCard } from '../game/entities/cards.entities';
import { CardsService } from '../cards/cards.service';
import { QuizAnswerStateEnum } from '../game/entities/quiz-answer-state.enum';
import { PostCardsToUserCommand } from '../game/commands/post-cards-to-user.command';
import { CardSelectionPendingEvent } from '../game/events/card-selection-pending.event';
import { ScoreChangedEvent } from '../game/events/score-changed.event';
import { PrizeChangeIncreasedEvent } from '../game/events/prize-change-increased.event';
import { TGD_Config } from '../../app.config';

@Injectable()
export class GuestsService {
  readonly nums = Messages.answerNumbers;
  private readonly logger = new Logger(GuestsService.name);
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
    @InjectBot() private bot: Telegraf,
    private eventBus: EventBus,
    private cmdBus: CommandBus,
    private cardServices: CardsService,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = await this.guestModel
      .findOne({ telegramId: createGuestDto.telegramId })
      .exec();
    if (guest) {
      return;
    }
    const newGuest = new this.guestModel(createGuestDto);
    const res = await newGuest.save();
    this.eventBus.publish(
      new UserRegisteredEvent(createGuestDto.telegramId, createGuestDto.name),
    );
    return res;
  }

  async findAll(): Promise<Guest[]> {
    return this.guestModel.find().exec();
  }

  async findById(id: number) {
    return this.guestModel.findOne({ telegramId: id }).exec();
  }

  async hideKeyboard(text: string) {
    this.logger.verbose(`Hide keyboard`);
    (await this.findAll()).forEach((guest) => {
      this.bot.telegram.sendMessage(guest.telegramId, text, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
    this.logger.verbose(`Keyboard hidden`);
  }

  async postQuestion(questionDto: QuestionDto, targetId = null) {
    const guests = await this.findAll();
    const extra = {
      reply_markup: {
        keyboard: [],
      },
    };
    questionDto.answers.forEach((item, index) => {
      extra.reply_markup.keyboard.push([
        { text: this.nums[index] + ' ' + item },
      ]);
    });
    if (!targetId) {
      guests.forEach((guest) => {
        this.bot.telegram.sendMessage(
          guest.chatId,
          `Внимание! Вопрос!\r\n${questionDto.text}\r\n\r\nВыбери ответ:`,
          extra,
        );
      });
    } else {
      const user = guests.find((x) => x.telegramId === targetId);
      if (user) {
        await this.bot.telegram.sendMessage(
          user.chatId,
          `Внимание! Вопрос!\r\n${questionDto.text}\r\n\r\nВыбери ответ:`,
          extra,
        );
      }
    }
  }

  async setPhoto(id: number, file: string) {
    const user = await this.findById(id);
    if (!user) {
      return;
    }
    user.photo = file;
    await user.save();
  }

  async getPhoto(id: number) {
    const image = await this.guestModel.findOne({ telegramId: id }).exec();
    return image.photo;
  }

  private async broadcast(message: string, extra: ExtraReplyMessage) {
    (await this.findAll()).forEach((guest) => {
      this.bot.telegram.sendMessage(guest.chatId, message, extra);
    });
  }

  async notifyAboutValidAnswer(tId: number) {
    const winner = await this.findById(tId);
    const message = `Правильный ответ предоставил: ${winner.name}`;
    await this.broadcast(message, {});
  }

  async dealCards() {
    const guests = await this.findAll();
    guests.forEach((guest) => {
      this.cmdBus.execute(new DealCardsCommand(guest.telegramId));
    });
  }

  private async getCards(guest: number, state: QuizAnswerStateEnum) {
    const buttons = (
      await this.cardServices.getCardsForState(
        guest,
        state,
      )
    ).map((card) => card.emoji + ' ' + card.cardName);
    console.log(`cards for ${guest} is ${JSON.stringify(buttons)}`);
    return buttons;
  }

  async sendButtonsToPlayers(
    playerId: number,
    playerState: QuizAnswerStateEnum,
    othersPlayersState: QuizAnswerStateEnum,
  ) {
    const guests = await this.findAll();
    for (const guest of guests) {
      if (guest.telegramId === playerId) {
        const buttons = await this.getCards(
          guest.telegramId,
          playerState,
        );
        await this.cmdBus.execute(
          new PostCardsToUserCommand(guest.telegramId, guest.chatId, buttons),
        );
      } else {
        const buttons = await this.getCards(
          guest.telegramId,
          othersPlayersState,
        );
        await this.cmdBus.execute(
          new PostCardsToUserCommand(guest.telegramId, guest.chatId, buttons),
        );
      }
    }
    await this.eventBus.publish(new CardSelectionPendingEvent());
  }

  async sendValidAnswerActions(validAnsweredId: number) {
    await this.sendButtonsToPlayers(
      validAnsweredId,
      QuizAnswerStateEnum.playerAnsweredCorrectly,
      QuizAnswerStateEnum.someoneAnsweredCorrectly,
    );
  }

  async sendRewardActions(telegramId: number) {
    await this.sendButtonsToPlayers(
      telegramId,
      QuizAnswerStateEnum.playerGettingReward,
      QuizAnswerStateEnum.someoneGettingReward,
    );
  }

  async sendPenaltyActions(telegramId: number) {
    this.logger.verbose(`Send penalty actions`);
    await this.sendButtonsToPlayers(
      telegramId,
      QuizAnswerStateEnum.playerGotPenalty,
      QuizAnswerStateEnum.someoneGettingPenalty
    );
  }


  async sendDealedCards(telegramId: number, cards: GameCard[]) {
    const user = await this.findById(telegramId);
    const cardsStr = cards
      .map((card) => {
        return card.getEmoji() + ' ' + card.description;
      })
      .join('\r\n');

    await this.bot.telegram.sendMessage(
      user.chatId,
      `Вы получили следующие карты: \r\n${cardsStr}`,
    );
  }

  async resetPlayersScore() {
    this.logger.verbose(`Resetting player scores`);
    return this.guestModel.updateMany({}, { score: 0 }).exec();
  }

  async updatePlayerScore(tId: number, number: number) {
    this.logger.verbose(`Changing score for player ${tId}, changes ${number}`);
    const player = await this.guestModel.findOne({ telegramId: tId }).exec();
    player.score = player.score + number;
    this.logger.verbose(`New score for ${tId} is ${player.score}`);
    this.eventBus.publish(new ScoreChangedEvent(tId, player.score));
    await player.save();
  }

  async changeWinningChance(tId: number, number: number) {
    this.logger.verbose(`Changing winning chance for player ${tId} by ${number}`);
    const player = await this.findById(tId);
    player.prizeChance = player.prizeChance + number;
    await player.save();
    this.eventBus.publish(
      new PrizeChangeIncreasedEvent(tId, player.prizeChance),
    );
  }

  async giveCards() {
    const guests = await this.findAll();
    for (const guest of guests) {
      const cards = await this.cardServices.getCards(guest.telegramId);
      if (cards.length < TGD_Config.cardsOnHand) {
        for (let i = cards.length; i < TGD_Config.cardsOnHand; i++) {
          const newcard = await this.cardServices.withdrawNewCard(guest.telegramId);
          await this.sendDealedCards(guest.telegramId, [newcard]);
        }
      }
    }
  }

  async sendQuestionToUser(telegramId: number, question: QuestionDto) {
    await this.postQuestion(question, telegramId);
  }

  async resetWinningChance() {
    await this.guestModel.updateMany({}, { prizeChance: 0 });
  }
}
