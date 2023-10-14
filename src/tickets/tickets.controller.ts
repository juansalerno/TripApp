import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TicketsController {
   constructor(private ticketsService: TicketsService) { }

   @Post()
   @ApiCreatedResponse({ description: 'Ticket created succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   @ApiForbiddenResponse({ description: 'Unauthorized Request' })
   createTicket(@Body() body: CreateTicketDto, @CurrentUser() user: User) {
      return this.ticketsService.create(body, user);
   }

   @Patch('/:id')
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'Ticket updated succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   @ApiForbiddenResponse({ description: 'Unauthorized Request' })
   updateTicket(@Param('id') id: string, @Body() body: UpdateTicketDto) {
      return this.ticketsService.update(+id, body);
   }

   @Get('/:id')
   @ApiOkResponse({ description: 'Ticket returned successfully' })
   @ApiNotFoundResponse({ description: 'Trip not found' })
   findTicket(@Param('id') id: string) {
      return this.ticketsService.findOne(+id);
   }
}
