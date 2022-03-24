import {
  Command,
  Ctx,
  InjectBot,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { Context } from '../../context.interface';
import { REGISTER_PHOTO_SCENE } from './scenes.const';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { GuestsService } from '../../guests/guests.service';
import { SharedService } from "../../shared/shared.service";
import { SocketEvents } from "../../shared/events.consts";
import { GlobalCommands } from '../global-commands';
import { Logger } from '@nestjs/common';
import { applySmartCrop } from '../../resources/smartcrop';


@Scene(REGISTER_PHOTO_SCENE)
export class RegisterPhotoScene {
  readonly logger = new Logger(RegisterPhotoScene.name);
  constructor(
    @InjectBot() private bot: Telegraf,
    private guestService: GuestsService,
    private sharedService: SharedService,
    private globalCmd: GlobalCommands,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.reply('давай, шли свою фотографию сучка');
    this.globalCmd.hideKeyboard(ctx);
  }

  @On('document')
  async onDocument(@Ctx() ctx: Context) {
    this.logger.warn(
      `${ctx.message.from.first_name} tried to use invalid photo`,
    );
    ctx.replyWithMarkdown(
      '[](https://i.ytimg.com/vi/pd342TR6PCM/hqdefault.jpg) Неправильно, попробуй еще раз',
    );
  }

  @On('photo')
  async onPhoto(@Message('photo') photo, @Ctx() ctx: Context) {
    const link = await this.bot.telegram.getFileLink(
      photo[photo.length - 1].file_id,
    );
    const regexp = new RegExp(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i);
    if (!regexp.test(link.toString())) {
      ctx.reply('не тот формат, давай жипег');
      return;
    }
    ctx.reply(`Ожидай, наша нейросеточка находит твою мородчку 😼`);
    const file = (
      await axios.get(link.toString(), {
        responseType: 'arraybuffer',
      })
    ).data;

    const result = await applySmartCrop(file, '', 450, 450);
    const buff = Buffer.from(result, 'binary').toString('base64');
    await this.guestService.setPhoto(ctx.message.from.id, buff);
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.PHOTOS_UPDATED_EVENT,
      {
        id: ctx.message.from.id,
    });
    ctx.reply('Кажись все получилось, чекни на экране что все ок');
    this.logger.verbose(
      `${ctx.message.from.id} - ${ctx.message.from.first_name} updated profile picture`,
    );
    this.onLeaveCommand(ctx);
  }

  @Command('leave')
  onLeaveCommand(@Ctx() ctx: Context) {
    ctx.scene.leave();
  }
}
