import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async reserve(userId: string, eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Evento no encontrado');

    if (event.availableTickets <= 0) {
      throw new BadRequestException('No hay boletos disponibles');
    }

    const existing = await this.reservationModel.findOne({
      user: userId,
      event: eventId,
    });
    if (existing) {
      throw new BadRequestException('Ya reservaste este evento');
    }

    await this.reservationModel.create({
      user: new Types.ObjectId(userId),
      event: new Types.ObjectId(eventId),
    });

    event.availableTickets -= 1;
    event.reservedBy.push(new Types.ObjectId(userId));
    await event.save();

    return { message: 'Reserva realizada con éxito' };
  }

  async cancel(userId: string, eventId: string) {
    const deleted = await this.reservationModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      event: new Types.ObjectId(eventId),
    });

    if (!deleted) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const event = await this.eventModel.findById(eventId);
    if (event) {
      event.availableTickets += 1;

      event.reservedBy = event.reservedBy.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await event.save();
    }

    return { message: 'Reserva cancelada con éxito' };
  }

  async listMyReservations(userId: string) {
    return this.reservationModel.find({ user: userId }).populate('event');
  }
}
