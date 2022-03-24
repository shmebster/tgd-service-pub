import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../game/events/user-registered.event';
import { StateService } from '../../state/state.service';
import { GameStateEnum } from '../../state/game-state.enum';
import { CardsService } from '../cards.service';
import { Logger } from '@nestjs/common';
@EventsHandler(UserRegisteredEvent)
export class CardsUserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(CardsUserRegisteredEventHandler.name);
  constructor(
    private stateService: StateService,
    private cardsService: CardsService,
  ) {}
  async handle(event: UserRegisteredEvent): Promise<any> {
    const state = await this.stateService.getState('main');
    this.logger.verbose(`Handle user reg event, game state is: ${state.value}`);
    if (state.value === GameStateEnum.onboarding) {
      this.logger.verbose(`Calling cardService to deal startup cards for ${event.telegramId}`);
      return await this.cardsService.dealStartCards(event.telegramId);
    }
  }
}
