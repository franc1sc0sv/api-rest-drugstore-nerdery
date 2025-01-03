import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { OrderModel } from 'src/common/models/order.model';
import { UserModel } from 'src/common/models/user.model';
import { createOrderResponseDto } from '../dtos/response/create-order-response.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaymentIntentModel } from 'src/common/models/payment-intent.model';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => createOrderResponseDto)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @CurrentUser() user: UserModel,
  ): Promise<createOrderResponseDto> {
    return await this.ordersService.createOrder(user);
  }

  @Query(() => [OrderModel])
  @UseGuards(GqlAuthGuard)
  async getOrders(@CurrentUser() user: UserModel): Promise<OrderModel[]> {
    return await this.ordersService.getOrders(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => OrderModel)
  async getOrderById(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<OrderModel> {
    return await this.ordersService.getOrderById(orderIdDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OrderModel)
  async cancelOrder(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<OrderModel> {
    return await this.ordersService.cancelOrder(orderIdDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PaymentIntentModel)
  async generateNewPaymentIntent(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<PaymentIntentModel> {
    return await this.ordersService.generateNewPaymentIntent(orderIdDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async cancelPayment(
    @Args('paymentIntentIdDto') paymentIntentIdDto: IdDto,
  ): Promise<boolean> {
    return await this.ordersService.cancelPayment(paymentIntentIdDto);
  }
}
