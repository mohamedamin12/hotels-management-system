import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { BookingStatus } from "src/utils/enum";


export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status?: BookingStatus;
}

