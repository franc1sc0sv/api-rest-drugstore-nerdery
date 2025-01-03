import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Order, OrderStatus } from '@prisma/client';
import { OrderItemModel } from './order-item.model';
import { PaymentIntentModel } from './payment-intent.model';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'OrderStatus',
});

@ObjectType()
export class OrderModel implements Partial<Order> {
  @Field()
  id: string;

  @Field()
  total: number;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  userId: string;

  @Field(() => [OrderItemModel])
  orderItems?: OrderItemModel[];

  @Field(() => [PaymentIntentModel])
  payments?: PaymentIntentModel[];
}
