import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'clara@gmail.com',
    description: 'The email of the User',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'P@ssw0rd!#45891',
    description: 'The password for the User',
  })
  password?: string;
}
