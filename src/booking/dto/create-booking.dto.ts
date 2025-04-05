import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BookingStatus } from 'src/utils/enum';


export class CreateBookingDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
