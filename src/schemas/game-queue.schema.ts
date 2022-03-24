import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum GameQueueTypes {
  additionalQuestion = 'additional_question',
  giveOutAPrize = 'give_out_a_prize',
  penalty = 'penalty',
}

export type GameQueueDocument = GameQueue & Document;

@Schema()
export class GameQueue {
  @Prop({ default: false })
  completed: boolean;
  @Prop()
  target: number;
  @Prop()
  type: GameQueueTypes;
}

export const GameQueueSchema = SchemaFactory.createForClass(GameQueue);
