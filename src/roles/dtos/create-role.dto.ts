import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   code: string;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   description: string;

}