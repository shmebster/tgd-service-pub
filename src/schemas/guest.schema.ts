import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { DEFAULT_PHOTO } from '../resources/default-photo';

export type GuestDocument = Guest & Document;

@Schema()
export class Guest {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  score: number;
  @Prop()
  telegramId: number;
  @Prop()
  chatId: number;
  @Prop({ default: DEFAULT_PHOTO })
  @Exclude()
  photo: string;
  @Prop({ default: 10 })
  prizeChance: number;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
