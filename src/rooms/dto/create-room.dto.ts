import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  capacity: number;

  @IsUUID()
  hotelId: string;
}
