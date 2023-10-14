import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 1
   })
   @IsNumber()
   @IsNotEmpty()
   @Min(1)
   userId: number;

   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 1
   })
   @IsNumber()
   @IsNotEmpty()
   @Min(1)
   tripId: number;

   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 1
   })
   @IsNumber()
   @Min(1)
   seats: number;
}