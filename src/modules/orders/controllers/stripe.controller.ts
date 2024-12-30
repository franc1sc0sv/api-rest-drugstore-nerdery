import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { Request } from 'express';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('stripe')
  async stripeWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    const signature = req.headers['stripe-signature'] as string;
    await this.stripeService.handleStripeWebhook(req.rawBody, signature);
  }
}
