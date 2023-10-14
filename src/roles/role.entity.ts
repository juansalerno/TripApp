import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Role {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   code: string;

   @Column()
   description: string;

   @OneToMany(() => User, user => user.role)
   users: User[];
}