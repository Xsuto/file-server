import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  ID: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  extension: string;
}

export type FileInterface = File;

export const FileSchema = SchemaFactory.createForClass(File);
