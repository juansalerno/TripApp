import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTicketDto {
   @ApiPropertyOptional({
      type: Number,
      description: 'This is an optional property',
   })
   @IsNumber()
   @IsOptional()
   @Min(0)
   taxAmount: number;

   @ApiPropertyOptional({
      type: Number,
      description: 'This is an optional property',
   })
   @IsNumber()
   @IsOptional()
   @Min(0)
   discountAmount: number;

}