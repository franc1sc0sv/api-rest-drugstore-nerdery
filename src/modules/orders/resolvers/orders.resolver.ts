import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Order } from 'src/common/dtos/order.dto';
import { UserDto } from 'src/common/dtos/user.dto';
import { createOrderResponseDto } from '../dtos/response/create-order-response.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => createOrderResponseDto)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @CurrentUser() user: UserDto,
  ): Promise<createOrderResponseDto> {
    return await this.ordersService.createOrder(user);
  }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async getOrders(@CurrentUser() user: UserDto): Promise<Order[]> {
    return await this.ordersService.getOrders(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Order)
  async getOrderById(@Args('orderIdDto') orderIdDto: IdDto): Promise<Order> {
    return await this.ordersService.getOrderById(orderIdDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async cancelOrder(@Args('orderIdDto') orderIdDto: IdDto): Promise<Order> {
    return await this.ordersService.cancelOrder(orderIdDto);
  }
}
