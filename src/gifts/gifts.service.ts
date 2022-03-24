import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prize, PrizeDocument, PrizeSchema } from '../schemas/prize.schema';
import { Model } from 'mongoose';
import { GiftDto } from './models/gift.dto';
import { getRandomInt } from '../helpers/rand-number';

@Injectable()
export class GiftsService {
  private readonly logger = new Logger(GiftsService.name);
  constructor(
    @InjectModel(Prize.name) private prizeModel: Model<PrizeDocument>,
  ) {}

  async import(gifts: GiftDto[]) {
    const createdGifts = [];
    for (const gift of gifts) {
      const newGift = new this.prizeModel({
        isGifted: gift.isGifted,
        name: gift.name,
        prizeID: gift.prizeID,
      });
      await newGift.save();
      createdGifts.push(newGift);
    }
    return createdGifts;
  }

  async getPrize(): Promise<PrizeDocument> {
    const gifts = await this.prizeModel.find({ isGifted: false }).exec();
    if (gifts.length === 0) {
      throw new NotFoundException('No gifts left');
    }
    const randGift = getRandomInt(0, gifts.length - 1);
    const gift = gifts[randGift];
    gift.isGifted = true;
    await gift.save();
    return gift;
  }

  async markAllAsUngifted() {
    await this.prizeModel
      .updateMany({ isGifted: true }, { isGifted: false })
      .exec();
  }

  async getRemainingPrizeCount(): Promise<number> {
    const gifts = await this.prizeModel.find({ isGifted: false }).exec();
    return gifts.length;
  }
}
