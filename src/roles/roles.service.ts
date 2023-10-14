import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
   constructor(@InjectRepository(Role) private repo: Repository<Role>) { }

   create(body: CreateRoleDto) {
      const role = this.repo.create(body);
      return this.repo.save(role);
   }

   async findByCode(code: string) {
      if (!code) {
         throw new NotFoundException('Role not found');
      }

      const role = await this.repo.findOne({
         where: { code },
         relations: { users: true }
      });

      if (!role) {
         throw new NotFoundException('Role not found');
      }

      return role;
   }
}
