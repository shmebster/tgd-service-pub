import { Module } from '@nestjs/common';
import { PenaltyController } from './penalty.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Penalty, PenaltySchema } from '../schemas/penalty.schema';
import { PenaltyService } from './penalty.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Penalty.name,
        schema: PenaltySchema,
      },
    ]),
  ],
  controllers: [PenaltyController],
  providers: [PenaltyService],
  exports: [PenaltyService],
})
export class PenaltyModule {}
