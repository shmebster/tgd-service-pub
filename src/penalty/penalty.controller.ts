import { Body, Controller, Get, Post } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { PenaltyDto } from './dto/penalty.dto';

@Controller('penalty')
export class PenaltyController {
  constructor(private penaltyService: PenaltyService) {
  }

  @Get()
  async getOne() {
    return this.penaltyService.getOne();
  }

  @Post('import')
  async import(@Body() penaltyDto: PenaltyDto[]) {
    return this.penaltyService.saveMany(penaltyDto);
  }
}
