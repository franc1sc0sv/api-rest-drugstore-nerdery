import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentIntent {
  @IsNumber()
  amount: number;

  @IsString()
  orderId: string;
}
