import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Post(':eventId')
  reserve(@Param('eventId') eventId: string, @User('userId') userId: string) {
    return this.service.reserve(userId, eventId);
  }

  @Delete(':eventId')
  cancel(@Param('eventId') eventId: string, @User('userId') userId: string) {
    return this.service.cancel(userId, eventId);
  }

  @Get('my')
  getMyReservations(@User('userId') userId: string) {
    return this.service.listMyReservations(userId);
  }
}
