import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BookingStatus } from '../../utils/enum';


export class CreateBookingDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'id for user' })
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'id for room' })
  roomId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'start date for booking' })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'end date for booking' })
  endDate: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  @ApiProperty({ description: 'status of booking' })
  status?: BookingStatus;
}
