import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dtos/create-trip.dto';

@Injectable()
export class TripsService {
   constructor(@InjectRepository(Trip) private repo: Repository<Trip>) { }

   create(body: CreateTripDto) {
      const trip = this.repo.create(body);
      return this.repo.save(trip);
   }

   find(destination?: string) {
      const parsedDestination = destination && destination.replace('+', ' ');

      return parsedDestination ? this.repo.createQueryBuilder('trip')
         .leftJoinAndSelect('trip.tickets', 'ticket')
         .where('LOWER(destination) = LOWER(:destination)', { destination: parsedDestination })
         .getMany() : this.repo.find({ relations: ['tickets'] });
   }

   async findOne(id: number, useRelations?: boolean) {
      if (!id) {
         throw new NotFoundException('Trip not found');
      }

      const trip = await this.repo.findOne({
         where: {
            id
         },
         relations: {
            tickets: useRelations ? useRelations : false
         }
      });

      if (!trip) {
         throw new NotFoundException('Trip not found');
      }

      return trip;
   }

   async update(id: number, attrs: Partial<Trip>) {
      const trip = await this.findOne(id);
      if (!trip) {
         throw new NotFoundException('trip not found')
      }

      try {
         Object.assign(trip, attrs);
         await this.repo.save(trip);
         return;
      } catch (e) {
         throw new BadRequestException('Something went wrong. Verify request data')
      }
   }

   async remove(id: number) {
      const trip = await this.findOne(id);
      if (!trip) {
         throw new NotFoundException('trip not found');
      }

      try {
         await this.repo.remove(trip);
         return;
      } catch (e) {
         throw new BadRequestException('Cannot remove trip if it has tickets associated.')
      }
   }
}
