import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
   let service: AuthService;
   let fakeUsersService: Partial<UsersService>;
   let bodyRequest: CreateUserDto = {
      name: 'Lucas',
      lastName: 'Sanchez',
      age: 20,
      address: 'Pinto 678',
      email: 'asdf@gmail.com',
      password: 'hola456'
   };


   beforeEach(async () => {
      const users: User[] = [];
      fakeUsersService = {
         find: (email: string) => {
            const filteredUsers = users.filter(user => user.email === email);
            return Promise.resolve(filteredUsers);
         },
         create: async (body: CreateUserDto, hashedPassword: string) => {
            const user = {
               id: 1,
               name: body.name,
               lastName: body.lastName,
               age: body.age,
               email: body.email,
               address: body.address,
               password: hashedPassword
            } as User;

            users.push(user);
            return Promise.resolve(user);
         }
      }

      const module = await Test.createTestingModule({
         providers: [
            AuthService,
            {
               provide: UsersService,
               useValue: fakeUsersService
            }
         ]
      }).compile();

      service = module.get(AuthService);
   });

   it('can create an instance of auth service', async () => {
      expect(service).toBeDefined();
   });

   it('creates a new user with a hashed password', async () => {
      const user = await service.signUp(bodyRequest);
      expect(user.password).not.toEqual('hola456');
   });

   it('throws an error if user signs up with email that is in use', async () => {
      await service.signUp(bodyRequest);
      await expect(service.signUp(bodyRequest)).rejects.toThrow(BadRequestException);
   });

   it('throws an error if signin is called with an unused email', async () => {
      await expect(service.signIn('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
   });

   it('throws an error if an invalid password is provided on signin', async () => {
      await service.signUp(bodyRequest);
      await expect(service.signIn('asdf@gmail.com', 'hola123')).rejects.toThrow(BadRequestException);
   });

   it('returns a user if correct password is provided', async () => {
      await service.signUp(bodyRequest);

      const user = await service.signIn('asdf@gmail.com', 'hola456');
      expect(user).toBeDefined();
   });

});

