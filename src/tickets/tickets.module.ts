import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { TripsService } from '../trips/trips.service';
import { Trip } from '../trips/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Trip])],
  controllers: [TicketsController],
  providers: [TicketsService, TripsService]
})
export class TicketsModule { }
