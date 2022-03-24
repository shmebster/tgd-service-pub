import { Controller, Get, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {
  }

  @Get(':id')
  async getUserCards(@Param('id') id: number) {
    return this.cardsService.getCards(id);
  }
}
