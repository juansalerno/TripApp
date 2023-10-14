import {
   IsEmail,
   IsString,
   IsNumber,
   Min,
   IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   lastName: string;

   @ApiProperty({
      type: Number,
      description: 'This is a required property',
      minimum: 0,
   })
   @IsNumber()
   @Min(0)
   age: number;

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   address: string;

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

   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   roleCode: string;
}