import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
   constructor(
      @InjectRepository(User) private repo: Repository<User>,
      private rolesService: RolesService
   ) { }

   async create(createUserDto: CreateUserDto, hashedPassword: string) {
      const user = this.repo.create(createUserDto);
      const role = await this.rolesService.findByCode(createUserDto.roleCode);

      if (!role) {
         throw new Error(`Role not found`);
      }

      user.password = hashedPassword;
      user.role = role;

      return this.repo.save(user);
   }


   findUsersByCriteria(criteria: Partial<User>): Promise<User[]> {
      const queryBuilder: SelectQueryBuilder<User> = this.repo.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role');
      let isActiveFieldSearched: boolean;
      let convertedValue;

      for (const [key, value] of Object.entries(criteria)) {
         isActiveFieldSearched = key.toLowerCase() === 'isactive';
         convertedValue = isActiveFieldSearched ? value === 'true' : value;

         queryBuilder.andWhere(`LOWER(user.${key}) = LOWER(:${key})`, { [key]: convertedValue });
      }

      return queryBuilder.getMany();
   }

   async findOne(id: number) {
      if (!id) {
         throw new NotFoundException('user not found');
      }

      const user = await this.repo.findOne({
         where: {
            id
         },
         relations: {
            tickets: true,
            role: true
         }
      });

      return user;
   }

   async update(id: number, attrs: Partial<User>) {
      const user = await this.findOne(id);

      if (!user) {
         throw new NotFoundException('user not found');
      }

      if (attrs.email && attrs.email !== user.email) {
         const users = await this.findUsersByCriteria({ email: attrs.email });
         if (users.length) {
            throw new BadRequestException('email already in use');
         }
      }

      try {
         Object.assign(user, attrs);
         return this.repo.save(user);
      } catch (e) {
         throw new BadRequestException('Something went wrong')
      }

   }

   async updateRole(id: number, body: UpdateUserRoleDto) {
      const user = await this.findOne(id);

      if (!user) {
         throw new NotFoundException('user not found');
      }

      const role = await this.rolesService.findByCode(body.roleCode);

      if (!role) {
         throw new NotFoundException(`Role not found`)
      }

      user.role = role;

      return this.repo.save(user);

   }

   async delete(id: number) {
      const user = await this.findOne(id);
      if (!user) {
         throw new NotFoundException('user not found');
      }

      try {
         const deletedUser = await this.update(id, { isActive: false });
         return deletedUser;
      } catch (e) {
         throw new BadRequestException('Something went wrong')
      }

   }

   async reinstate(id: number) {
      const user = await this.findOne(id);
      if (!user) {
         throw new NotFoundException('user not found');
      }

      try {
         const reinstatedUser = await this.update(id, { isActive: true });
         return reinstatedUser;
      } catch (e) {
         throw new BadRequestException('Something went wrong')
      }

   }

   async deleteCurrentUser(user: User) {
      if (!user) throw new NotFoundException('user not found');

      if (!user.isActive) throw new BadRequestException('User already deleted')

      return this.delete(user.id);
   }

}
