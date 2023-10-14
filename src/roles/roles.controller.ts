import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
   constructor(private rolesService: RolesService) { }

   @Post()
   @ApiCreatedResponse({ description: 'Role created Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   createTrip(@Body() body: CreateRoleDto) {
      return this.rolesService.create(body);
   }

   @Get()
   @ApiOkResponse({ description: 'Roles were returned successfully' })
   findRole(@Query('code') code: string) {
      return this.rolesService.findByCode(code);
   }
}
