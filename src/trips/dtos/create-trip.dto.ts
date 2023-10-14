import {
   IsString,
   IsNumber,
   IsNotEmpty,
   IsDateString,
   Min
} from 'class-validator';
import { IsBefore } from '../validators/is-before.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   destination: string;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsDateString({ strict: true })
   @IsBefore('endDate', {
      message: 'Start date should be prior to the end Date',
   })
   startDate: string;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsDateString({ strict: true })
   endDate: string;

   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 0
   })
   @IsNumber()
   @Min(0)
   availableSeats: number;

   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 0
   })
   @IsNumber()
   @Min(0)
   basePrice: number;
}