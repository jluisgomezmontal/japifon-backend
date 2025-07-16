import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(data: Partial<Event>, userId: string): Promise<Event> {
    if (!data.capacity || data.capacity <= 0) {
      throw new BadRequestException('Capacity must be greater than 0');
    }
    data.availableTickets = data.capacity;
    data.organizer = new Types.ObjectId(userId);

    const event = new this.eventModel(data);
    return event.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel
      .find()
      .populate('reservedBy', 'email')
      .exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate('reservedBy', 'email')
      .exec();

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async updateEvent(
    id: string,
    data: Partial<Event>,
    userId: string,
  ): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('Only the organizer can update this event');
    }

    if (data.capacity && data.capacity <= 0) {
      throw new BadRequestException('Capacity must be greater than 0');
    }

    if (data.capacity) {
      const ticketsUsed = event.capacity - event.availableTickets;
      if (data.capacity < ticketsUsed) {
        throw new BadRequestException(
          'Capacity cannot be less than already booked tickets',
        );
      }
      data.availableTickets = data.capacity - ticketsUsed;
    }

    Object.assign(event, data);
    return event.save();
  }

  async deleteEvent(id: string, userId: string): Promise<{ message: string }> {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('Only the organizer can delete this event');
    }

    await this.eventModel.deleteOne({ _id: id });
    return { message: 'Event deleted successfully' };
  }
}
