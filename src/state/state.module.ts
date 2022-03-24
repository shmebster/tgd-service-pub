import { Module } from '@nestjs/common';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from '../schemas/state.schema';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: State.name,
        schema: StateSchema,
      },
    ]),
    SharedModule,
    CqrsModule,
  ],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
