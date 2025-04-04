import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateHotelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    rating?: number;
}

