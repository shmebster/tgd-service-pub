import { Global, Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { DealCardsCmdHandler } from './command-handlers/deal-cards.cmd.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '../schemas/cards.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { StateService } from '../state/state.service';
import { StateModule } from '../state/state.module';
import { CardsUserRegisteredEventHandler } from './event-handlers/cards-user-registered.event.handler';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    CqrsModule,
    StateModule,
  ],
  providers: [
    CardsService,
    DealCardsCmdHandler,
    CardsUserRegisteredEventHandler,
  ],
  controllers: [CardsController],
  exports: [CardsService]
})
export class CardsModule {}
