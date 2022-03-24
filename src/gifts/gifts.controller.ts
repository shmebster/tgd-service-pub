import { Body, Controller, Get, Post } from '@nestjs/common';
import { GiftDto } from './models/gift.dto';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private giftsService: GiftsService) {
  }
  @Get()
  async getGift() {
    return this.giftsService.getPrize();
  }

  @Post('import')
  async importGifts(@Body() gifts: GiftDto[]) {
    return await this.giftsService.import(gifts);
  }
}
