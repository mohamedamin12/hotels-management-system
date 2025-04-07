import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Room name'})
  name: string;

  @IsString()
  @ApiProperty({description: 'Room description'})
  description: string;

  @IsNumber()
  @ApiProperty({description: 'Room Price'})
  price: number;

  @IsNumber()
  @ApiProperty({description: 'Room capacity'})
  capacity: number;

  @IsUUID()
  @ApiProperty({description: 'Hotel ID'})
  hotelId: string;
}
