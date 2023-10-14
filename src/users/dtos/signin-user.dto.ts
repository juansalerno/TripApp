import {
   IsEmail,
   IsString,
   IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsEmail()
   @IsNotEmpty()
   email: string;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   password: string;
}