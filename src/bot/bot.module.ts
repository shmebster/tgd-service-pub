import { BotUpdate } from './bot.update';
import { forwardRef, Module } from '@nestjs/common';
import { GuestsModule } from '../guests/guests.module';
import { RegisterScene } from './scenes/register.scene';
import { RegisterNamePrompt } from './scenes/register.name.prompt';
import { EchoService } from './EchoService';
import { QuizScene } from './scenes/quiz.scene';
import { QuizModule } from '../quiz/quiz.module';
import { RegisterPhotoScene } from './scenes/register.photo.scene';
import { SharedModule } from '../shared/shared.module';
import { GlobalCommands } from './global-commands';
import { CqrsModule } from '@nestjs/cqrs';
import { TgPostCardsToUserCommandHandler } from './command-handlers/tg.post-cards-to-user.command.handler';
import { TgCardSelectionSceneCommandHandler } from './command-handlers/tg.card-selection-scene-command.handler';
import { RemoveCardFromUserCommandHandler } from './command-handlers/remove-card-from-user-command.handler';
import { AppModule } from '../app.module';

const cmdHandles = [
  TgPostCardsToUserCommandHandler,
  TgCardSelectionSceneCommandHandler,
  RemoveCardFromUserCommandHandler,
];

@Module({
  imports: [
    forwardRef(() => GuestsModule),
    forwardRef(() => QuizModule),
    SharedModule,
    CqrsModule,
    forwardRef(() => AppModule),
  ],
  providers: [
    BotUpdate,
    RegisterScene,
    RegisterNamePrompt,
    EchoService,
    QuizScene,
    RegisterPhotoScene,
    GlobalCommands,
    ...cmdHandles,
  ],
  exports: [EchoService],
})
export class BotModule {}
