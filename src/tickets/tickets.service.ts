import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { TripsService } from '../trips/trips.service';
import { User } from '../users/user.entity';

@Injectable()
export class TicketsService {
   constructor(
      @InjectRepository(Ticket) private ticketsRepo: Repository<Ticket>,
      private tripsService: TripsService
   ) { }

   async create(body: CreateTicketDto, user: User) {
      let discountAmount = 0;
      let taxAmount = 0;

      const trip = await this.tripsService.findOne(body.tripId);

      if (body.seats > trip.availableSeats) {
         throw new BadRequestException('There is not enough available seats for this trip');
      }

      if (user.age > 60) {
         discountAmount = trip.basePrice * 0.25;
         taxAmount = trip.basePrice * 0.105;
      } else if (user.age < 60 && user.age > 18) {
         taxAmount = trip.basePrice * 0.21;
      }

      trip.availableSeats -= body.seats;

      const ticket = this.ticketsRepo.create(body);
      ticket.taxAmount = taxAmount;
      ticket.discountAmount = discountAmount;
      ticket.totalPrice = (trip.basePrice * body.seats) + (taxAmount * body.seats) - (discountAmount * body.seats);
      ticket.trip = trip;
      ticket.user = user;

      await this.tripsService.update(trip.id, trip);

      return this.ticketsRepo.save(ticket);
   }

   async findOne(id: number) {
      if (!id) {
         throw new NotFoundException('Ticket not found');
      }

      const ticket = await this.ticketsRepo.findOne({
         where: {
            id
         },
         relations: {
            trip: true,
            user: true
         }
      });

      if (!ticket) {
         throw new NotFoundException('Ticket not found');
      }

      return ticket;
   }

   async update(id: number, attrs: Partial<Ticket>) {
      const ticket = await this.findOne(id);
      const trip = await this.tripsService.findOne(ticket.tripId);
      const taxAmount = attrs.taxAmount ? attrs.taxAmount : ticket.taxAmount;
      const discountAmount = attrs.discountAmount ? attrs.discountAmount : ticket.discountAmount;

      ticket.totalPrice = (trip.basePrice * ticket.seats) + (taxAmount * ticket.seats) - (discountAmount * ticket.seats);

      Object.assign(ticket, attrs);

      return this.ticketsRepo.save(ticket);
   }
}
