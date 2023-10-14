import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class AuthService {
   constructor(private usersService: UsersService) { }

   async signUp(body: CreateUserDto) {
      const users = await this.usersService.findUsersByCriteria({ email: body.email });

      if (users.length) {
         throw new BadRequestException('Email already in use');
      }

      const saltOrRounds = 10;
      const hash = await bcrypt.hash(body.password, saltOrRounds);

      const user = await this.usersService.create(body, hash);
      return user;
   }

   async signIn(email: string, password: string) {
      const [user] = await this.usersService.findUsersByCriteria({ email });
      if (!user) {
         throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         throw new BadRequestException('Invalid password')
      }

      if (!user.isActive) {
         throw new BadRequestException('User account is inactive')
      }

      return user;
   }
}