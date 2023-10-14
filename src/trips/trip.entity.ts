import { Ticket } from '../tickets/ticket.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Trip {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   destination: string;

   @Column()
   startDate: string;

   @Column()
   endDate: string;

   @Column()
   availableSeats: number;

   @Column()
   basePrice: number;

   @OneToMany(() => Ticket, (ticket) => ticket.trip)
   tickets: Ticket[];
}