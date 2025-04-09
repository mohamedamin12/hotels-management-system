import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateStripePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

}
