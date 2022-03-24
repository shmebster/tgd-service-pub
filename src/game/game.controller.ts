import { Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {
  }

  @Post(':id/complete')
  async markQueueAsCompleted(@Param('id') id: string) {
    return this.gameService.markQueueAsCompleted(id);
  }

  @Post('pause')
  async pauseGame() {
    return this.gameService.pauseGame();
  }

  @Post('resume')
  async resumeGame() {
    return this.gameService.resumeGame();
  }

  @Get('state')
  async getState() {
    return this.gameService.getState();
  }
}
