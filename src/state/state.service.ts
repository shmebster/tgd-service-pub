import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { State, StateDocument } from '../schemas/state.schema';
import { Model } from 'mongoose';
import { EventBus } from '@nestjs/cqrs';
import { PrepareGameEvent } from '../game/events/prepare-game.event';

interface StateDTO {
  name: string;
  value: string;
}

@Injectable()
export class StateService {
  constructor(
    @InjectModel(State.name) private stateModel: Model<StateDocument>,
    private eventBus: EventBus,
  ) {}

  async getState(name: string) {
    const state = await this.stateModel.findOne({ state: name }).exec();
    if (!state) {
      const newState = new this.stateModel({
        state: name,
        value: 'initial',
      });
      await newState.save();
      return newState;
    };
    return state;
  }

  async setState(name: string, newValue: string) {
    if (newValue === 'onboarding') {
      this.eventBus.publish(new PrepareGameEvent());
    }
    const stateEntity = await this.getState(name);
    stateEntity.value = newValue;
    await stateEntity.save();
    return stateEntity;
  }
}
