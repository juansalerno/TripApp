import {
   BadRequestException,
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   HttpCode,
   NotFoundException,
   Param,
   Patch,
   Post,
   Query,
   Session,
   UseGuards,
   UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
   constructor(
      private usersService: UsersService,
      private authService: AuthService
   ) { }

   @Post('/signup')
   @ApiCreatedResponse({ description: 'Created Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signUp(body);
      session.userId = user.id;
      delete user.role.users;

      return user;
   }

   @Post('/signin')
   @ApiCreatedResponse({ description: 'Signed In Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   async signIn(@Body() body: SignInUserDto, @Session() session: any) {
      const user = await this.authService.signIn(body.email, body.password);
      session.userId = user.id;
      return user;
   }

   @Post('/signout')
   @HttpCode(200)
   @ApiCreatedResponse({ description: 'Signed Out Succesfully' })
   signOut(@Session() session: any) {
      session.userId = null;
   }

   @Get('/whoami')
   @ApiOkResponse({ description: 'User returned successfully' })
   whoAmI(@CurrentUser() user: User) {
      return user;
   }

   @Get()
   @ApiOkResponse({ description: 'Users were returned successfully' })
   findUsersByCriteria(@Query() criteria: Partial<User>) {
      return this.usersService.findUsersByCriteria(criteria);
   }

   @Get('/:id')
   @ApiOkResponse({ description: 'User was returned successfully' })
   @ApiNotFoundResponse({ description: 'User not found' })
   async findUserById(@Param('id') id: string) {
      const user = await this.usersService.findOne(+id);
      if (!user) {
         throw new NotFoundException('user not found')
      }

      return user;
   }

   @Patch('/:id')
   @UseGuards(AuthGuard)
   @ApiOkResponse({ description: 'Updated Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
      return this.usersService.update(+id, body);
   }

   @Patch('/:id/role')
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'Updated Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   updateUserRole(@Param('id') id: string, @Body() body: UpdateUserRoleDto) {
      return this.usersService.updateRole(+id, body);
   }

   @Delete('/:id')
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'User deleted successfully' })
   @ApiNotFoundResponse({ description: 'User not found' })
   @ApiBadRequestResponse({ description: 'Cannot delete user if it has tickets associated' })
   deleteUser(@Param('id') id: string) {
      return this.usersService.delete(+id);
   }

   @Delete('')
   @ApiOkResponse({ description: 'User deleted successfully' })
   @ApiNotFoundResponse({ description: 'User not found' })
   @ApiBadRequestResponse({ description: 'Cannot delete user if it has tickets associated' })
   deleteCurrentUser(@CurrentUser() user: User, @Session() session: any) {
      session.userId = null;
      return this.usersService.deleteCurrentUser(user);
   }


   @Patch('/:id/reinstate')
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'Reinstated Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   reinstateUser(@Param('id') id: string) {
      return this.usersService.reinstate(+id);
   }

}
