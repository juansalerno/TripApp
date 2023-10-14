import {
   IsEmail,
   IsString,
   IsNumber,
   Min,
   IsOptional,
   IsBoolean
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsString()
   @IsOptional()
   name: string;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsString()
   @IsOptional()
   lastName: string;

   @ApiPropertyOptional({
      type: Number,
      description: 'This is an optional property',
      minimum: 0
   })
   @IsNumber()
   @Min(0)
   @IsOptional()
   age: number;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property'
   })
   @IsString()
   @IsOptional()
   address: string;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsEmail()
   @IsOptional()
   email: string;

   @ApiPropertyOptional({
      type: String,
      description: 'This is an optional property',
   })
   @IsString()
   @IsOptional()
   password: string;
}