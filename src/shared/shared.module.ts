import { forwardRef, Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { AppModule } from '../app.module';
import { GameModule } from '../game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from '../schemas/config.schema';
@Global()
@Module({
  imports: [
    forwardRef(() => AppModule),
    GameModule,
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
