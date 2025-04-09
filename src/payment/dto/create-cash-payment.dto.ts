import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCashPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

}
