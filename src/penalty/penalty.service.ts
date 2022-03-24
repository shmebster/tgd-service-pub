import { Injectable } from '@nestjs/common';
import { PenaltyDto } from './dto/penalty.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Penalty, PenaltyDocument } from '../schemas/penalty.schema';
import { Model } from 'mongoose';

@Injectable()
export class PenaltyService {
  constructor(
    @InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>,
  ) {}
  async saveMany(penaltyDto: PenaltyDto[]) {
    for (const item of penaltyDto) {
      const newPenalty = new this.penaltyModel({
        text: item.text,
      });
      await newPenalty.save();
    }
  }

  async getOne() {
    const item = await this.penaltyModel.findOne({ isCompleted: false }).exec();
    item.isCompleted = true;
    await item.save();
    return item;
  }

  async resetPenalties(): Promise<any> {
    await this.penaltyModel.updateMany({}, { isCompleted: false });
  }
}
