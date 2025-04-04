import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";


export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({ description: "enter the new password"})
    newPassword:string;
    
    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    resetPasswordToken:string;
}