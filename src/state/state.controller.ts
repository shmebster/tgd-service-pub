import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StateService } from './state.service';
import { SharedService } from '../shared/shared.service';
import { EventBus } from '@nestjs/cqrs';
import { GameStartedEvent } from '../game/events/game-started.event';

interface SetStateDTO {
  state: string;
  value: string;
}

@Controller('state')
export class StateController {
  constructor(
    private stateService: StateService,
    private sharedService: SharedService,
    private eventBus: EventBus,
  ) {}

  @Get(':name')
  async getState(@Param('name') name: string) {
    return await this.stateService.getState(name);
  }

  @Post()
  async setState(@Body() setStateDto: SetStateDTO) {
    const res = await this.stateService.setState(
      setStateDto.state,
      setStateDto.value,
    );
    if (setStateDto.value === 'quiz') {
      this.eventBus.publish(new GameStartedEvent());
    }
    this.sharedService.sendSocketNotificationToAllClients('state_changed', res);
    return res;
  }
}
