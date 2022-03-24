import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Prize {
  @Prop()
  prizeID: number;
  @Prop({ default: false })
  isGifted: boolean;
  @Prop()
  name: string;
}
export type PrizeDocument = Prize & Document;
export const PrizeSchema = SchemaFactory.createForClass(Prize);
