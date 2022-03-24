import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StateDocument = State & Document;

@Schema()
export class State {
  @Prop()
  state: string;
  @Prop()
  value: string;
}

export const StateSchema = SchemaFactory.createForClass(State);
