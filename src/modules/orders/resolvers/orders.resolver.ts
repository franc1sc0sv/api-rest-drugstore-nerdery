import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { OrderModel } from 'src/common/models/order.model';
import { UserModel } from 'src/common/models/user.model';
import { createOrderResponse } from '../dtos/response/create-order-response.response';
import { IdDto } from 'src/common/dtos/id.dto';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaymentIntentModel } from 'src/common/models/payment-intent.model';
import { UnifiedAuthGuard } from 'src/common/guards/unified-auth.guard';
import { OrderItemModel } from 'src/common/models/order-item.model';
import { OrderItemLoader } from 'src/modules/loaders/order/order-items/order-item.loader';
import { PaymentLoader } from 'src/modules/loaders/order/payments/payment.loader';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemLoader: OrderItemLoader,
    private readonly paymentLoader: PaymentLoader,
  ) {}

  @Mutation(() => createOrderResponse)
  @UseGuards(UnifiedAuthGuard)
  async createOrder(
    @CurrentUser() user: UserModel,
  ): Promise<createOrderResponse> {
    return await this.ordersService.createOrder(user);
  }

  @Query(() => [OrderModel])
  @UseGuards(UnifiedAuthGuard)
  async getOrders(@CurrentUser() user: UserModel): Promise<OrderModel[]> {
    return await this.ordersService.getOrders(user);
  }

  @UseGuards(UnifiedAuthGuard)
  @Query(() => OrderModel)
  async getOrderById(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<OrderModel> {
    return await this.ordersService.getOrderById(orderIdDto);
  }

  @UseGuards(UnifiedAuthGuard)
  @Mutation(() => OrderModel)
  async cancelOrder(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<OrderModel> {
    return await this.ordersService.cancelOrder(orderIdDto);
  }

  @UseGuards(UnifiedAuthGuard)
  @Mutation(() => PaymentIntentModel)
  async generateNewPaymentIntent(
    @Args('orderIdDto') orderIdDto: IdDto,
  ): Promise<PaymentIntentModel> {
    return await this.ordersService.generateNewPaymentIntent(orderIdDto);
  }

  @UseGuards(UnifiedAuthGuard)
  @Mutation(() => Boolean)
  async cancelPayment(
    @Args('paymentIntentIdDto') paymentIntentIdDto: IdDto,
  ): Promise<boolean> {
    return await this.ordersService.cancelPayment(paymentIntentIdDto);
  }

  @ResolveField(() => [OrderItemModel], { nullable: true })
  async orderItems(@Parent() order: OrderModel): Promise<OrderItemModel[]> {
    const { id: orderId } = order;
    return this.orderItemLoader.batchOrderItems.load(orderId);
  }

  @ResolveField(() => [PaymentIntentModel], { nullable: true })
  async payments(@Parent() order: OrderModel): Promise<PaymentIntentModel[]> {
    const { id: orderId } = order;
    return this.paymentLoader.batchPaymentsByOrderId.load(orderId);
  }
}
