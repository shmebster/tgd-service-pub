import {
  Controller,
  Get, Param, Res
} from "@nestjs/common";
import { EchoService } from '../bot/EchoService';
import { GuestsService } from './guests.service';
import { Response } from 'express';
@Controller('guests')
export class GuestsController {
  constructor(
    private echoService: EchoService,
    private guestService: GuestsService,
  ) {}

  @Get()
  async listAll() {
    const result = await this.guestService.findAll();
    return result.map((m) => {
      return {
        name: m.name,
        score: m.score,
        telegramId: m.telegramId,
      };
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.guestService.findById(id);
  }

  @Get('photo/:id')
  async getPhoto(@Param('id') id: number, @Res() res: Response) {
    const photo = await this.guestService.getPhoto(id);
    const buff = Buffer.from(photo, 'base64');
    res.contentType('image/jpeg');
    res.end(buff);
  }
  @Get('ping')
  async ping() {
    const users = await this.guestService.findAll();
    users.forEach((u) => {
      this.echoService.enterQuiz(u.chatId);
    });
  }
}
