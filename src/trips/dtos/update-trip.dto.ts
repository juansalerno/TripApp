import {
   IsString,
   IsNumber,
   IsNotEmpty,
   IsDateString,
   Min,
   IsOptional
} from 'class-validator';
import { IsBefore } from '../validators/is-before.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTripDto {
   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsString()
   @IsNotEmpty()
   @IsOptional()
   destination: string;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsDateString({ strict: true })
   @IsBefore('endDate', {
      message: 'Start date should be prior to the end Date',
   })
   @IsOptional()
   startDate: string;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsDateString({ strict: true })
   @IsOptional()
   endDate: string;

   @ApiPropertyOptional({
      type: Number,
      description: 'This is an optional property',
      minimum: 0
   })
   @IsNumber()
   @Min(0)
   @IsOptional()
   availableSeats: number;

   @ApiPropertyOptional({
      type: Number,
      description: 'This is an optional property',
      minimum: 0
   })
   @IsNumber()
   @Min(0)
   @IsOptional()
   basePrice: number;
}