/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { RequestWithUser } from 'src/types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(@Body() body: any, @Req() req: RequestWithUser) {
    return this.eventsService.createEvent(body, req.user['sub']);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateEvent(@Param('id') id: string, @Body() body: any, @Req() req: RequestWithUser) {
    return this.eventsService.updateEvent(id, body, req.user['sub']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.deleteEvent(id, req.user['sub']);
  }
}
