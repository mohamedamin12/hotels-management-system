import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";
import { UserType } from "../../utils/enum";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2 , 150)
  @ApiProperty({ description: "enter user name"})
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ description: "enter the email"})
  email:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: "enter the password"})
  password: string;

  @IsEnum( UserType , { message: 'Role must be one of: admin, user' })
  @IsNotEmpty()
  role: UserType;
}