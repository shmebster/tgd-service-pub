import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prize, PrizeSchema } from '../schemas/prize.schema';
import { GiftsController } from './gifts.controller';
import { GiftGameStartEventHandler } from './event-handlers/gift-game-start-event.handler';

const eventHandlers = [GiftGameStartEventHandler];
const cmdHandlers = [];
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prize.name, schema: PrizeSchema },
    ]),
  ],
  providers: [GiftsService, ...eventHandlers, ...cmdHandlers],
  controllers: [GiftsController],
  exports: [GiftsService],
})
export class GiftsModule {}
