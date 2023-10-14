import { Exclude } from 'class-transformer';
import { Ticket } from '../tickets/ticket.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string;

   @Column()
   lastName: string;

   @Column()
   age: number;

   @Column()
   address: string;

   @Column()
   email: string;

   @Column()
   @Exclude()
   password: string;

   @Column({ default: true })
   isActive: boolean;

   @OneToMany(() => Ticket, (ticket) => ticket.user)
   tickets: Ticket[];

   @ManyToOne(() => Role, role => role.users)
   role: Role;
}