import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop()
  key: string;
  @Prop()
  value: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
