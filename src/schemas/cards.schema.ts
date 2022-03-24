import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuizAnswerStateEnum } from '../game/entities/quiz-answer-state.enum';

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop()
  telegramId: number;
  @Prop({ default: false})
  used: boolean;
  @Prop()
  cardType: string;
  @Prop()
  cardName: string;
  @Prop()
  emoji: string;
  @Prop()
  mightBePlayed: QuizAnswerStateEnum;
}

export const CardSchema = SchemaFactory.createForClass(Card);
