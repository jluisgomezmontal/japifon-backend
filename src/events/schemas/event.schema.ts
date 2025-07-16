import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ required: true, min: 0 })
  availableTickets: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organizer: Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  reservedBy: Types.ObjectId[];

}

export const EventSchema = SchemaFactory.createForClass(Event);
