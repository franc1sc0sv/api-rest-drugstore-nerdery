import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Module({
  providers: [
    StripeService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService): Stripe => {
        return new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
          apiVersion: '2024-12-18.acacia',
        });
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  controllers: [StripeController],
  exports: ['STRIPE_CLIENT', StripeService],
})
export class StripeModule {}
