import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class QuestionStorage {
  @Prop()
  text: string;
  @Prop()
  answers: string[];
  @Prop()
  valid: string;
  @Prop({ default: false })
  isAnswered: boolean;
  @Prop({ default: false })
  isAnsweredCorrectly: boolean;
}

export const QuestionsStorageSchema = SchemaFactory.createForClass(QuestionStorage);
export type QuestionStorageDocument = QuestionStorage & Document;
