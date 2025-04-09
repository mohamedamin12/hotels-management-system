import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { I18nService } from "nestjs-i18n";

export class CreateHotelDto {

  constructor(private readonly i18n: I18nService) {}
  
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

