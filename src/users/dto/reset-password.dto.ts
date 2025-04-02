import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";


export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({ description: "enter the new password"})
    newPassword:string;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    userId:number;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    resetPasswordToken:string;
}