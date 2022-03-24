import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestsModule } from './guests/guests.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { sessionMiddleware } from './middleware/session.middleware';
import { QuizModule } from './quiz/quiz.module';
import { SocketGateway } from './socket/socket.gateway';
import { SharedModule } from './shared/shared.module';
import { StateModule } from './state/state.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler/scheduler.service';
import { GameModule } from './game/game.module';
import { CqrsModule } from '@nestjs/cqrs';
import { SocketHandlersModule } from './socket/socket-handlers/socket-handlers.module';
import { CardsModule } from './cards/cards.module';
import { PenaltyModule } from './penalty/penalty.module';
import { VoiceModule } from './voice/voice.module';
import { GiftsModule } from './gifts/gifts.module';
import {TGD_Config} from "../app.config";

@Module({
  imports: [
    MongooseModule.forRoot(TGD_Config.mongoDbUri),
    TelegrafModule.forRoot({
      token: '2023427360:AAH_ZxU9dk7wLko_v8LnuRj1Zt3tclyrPnA',
      middlewares: [sessionMiddleware],
      include: [BotModule],
    }),
    GuestsModule,
    BotModule,
    QuizModule,
    SocketGateway,
    SharedModule,
    ScheduleModule.forRoot(),
    StateModule,
    GameModule,
    CqrsModule,
    SocketHandlersModule,
    CardsModule,
    PenaltyModule,
    VoiceModule,
    GiftsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, SchedulerService],
  exports: [AppService, SocketGateway],
})
export class AppModule {}
