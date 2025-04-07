import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateHotelDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'hotel name' })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'hotel location' })
    location?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'hotel description' })
    description?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'hotel rating' })
    rating?: number;
}

