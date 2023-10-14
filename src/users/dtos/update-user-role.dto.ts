import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
   @ApiProperty({
      type: String,
      description: 'This is a required property',
   })
   @IsString()
   @IsNotEmpty()
   roleCode: string;
}