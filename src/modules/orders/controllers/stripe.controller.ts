import { Body, Controller, Headers, Post } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('stripe')
  async stripeWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    await this.stripeService.handleStripeWebhook(rawBody, signature);
  }
}
