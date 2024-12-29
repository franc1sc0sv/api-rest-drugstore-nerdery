import { Module } from '@nestjs/common';
import { OrdersResolver } from './resolvers/orders.resolver';
import { OrdersService } from './services/orders.service';
import { CartsService } from '../carts/carts.service';
import { StripeService } from './services/stripe.service';
import { StripeModule } from './stripe.module';

@Module({
  imports: [StripeModule],
  providers: [OrdersService, OrdersResolver, CartsService, StripeService],
})
export class OrdersModule {}
