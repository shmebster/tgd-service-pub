import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop()
  text: string;
  @Prop()
  answers: string[];
  @Prop()
  valid: string;
  @Prop()
  answered: boolean;
  @Prop()
  answeredBy: number;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
