import { Trip } from '../trips/trip.entity';
import { User } from '../users/user.entity';
import {
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   Entity,
   ManyToOne
} from 'typeorm';

@Entity()
export class Ticket {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   userId: number;

   @Column()
   tripId: number;

   @Column()
   seats: number;

   @Column()
   taxAmount: number;

   @Column()
   discountAmount: number;

   @Column()
   totalPrice: number;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   @ManyToOne(() => User, (user) => user.tickets)
   user: User;

   @ManyToOne(() => Trip, (trip) => trip.tickets)
   trip: Trip;
}