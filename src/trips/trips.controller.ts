import { Body, Controller, Get, Param, Post, Patch, Query, Delete, UseGuards } from '@nestjs/common';
import { CreateTripDto } from './dtos/create-trip.dto';
import { TripsService } from './trips.service';
import { UpdateTripDto } from './dtos/update-trip.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
   constructor(private tripsService: TripsService) { }

   @Post()
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiCreatedResponse({ description: 'Trip created Succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   createTrip(@Body() body: CreateTripDto) {
      return this.tripsService.create(body);
   }

   @Get()
   @ApiOkResponse({ description: 'Trips were returned successfully' })
   findAllTrips(@Query('destination') destination: string) {
      return this.tripsService.find(destination);
   }

   @Get('/:id')
   @ApiOkResponse({ description: 'Trip returned successfully' })
   @ApiNotFoundResponse({ description: 'Trip not found' })
   findTrip(@Param('id') id: string) {
      return this.tripsService.findOne(+id, true);
   }

   @Patch('/:id')
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'Trip updated succesfully' })
   @ApiBadRequestResponse({ description: 'Bad Request' })
   updateTrip(@Param('id') id: string, @Body() body: UpdateTripDto) {
      return this.tripsService.update(+id, body);
   }

   @Delete('/:id')
   @UseGuards(AuthGuard)
   @UseGuards(AdminGuard)
   @ApiOkResponse({ description: 'Trip removed successfully' })
   @ApiNotFoundResponse({ description: 'Trip not found' })
   removeTrip(@Param('id') id: string) {
      return this.tripsService.remove(+id);
   }
}
