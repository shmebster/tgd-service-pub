import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Penalty {
  @Prop()
  text: string;
  @Prop({ default: false })
  isCompleted: boolean;
  @Prop()
  completedBy: number;
}

export type PenaltyDocument = Penalty & Document;
export const PenaltySchema = SchemaFactory.createForClass(Penalty);
