import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: "enter the email" })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ description: "enter the password"})
  email: string;
}