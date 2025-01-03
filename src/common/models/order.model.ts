import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.model';
import { PaymentIntent } from './payment-intent.model';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'OrderStatus',
});

@ObjectType()
export class Order {
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

  @Field(() => [OrderItem])
  orderItems?: OrderItem[];

  @Field(() => [PaymentIntent])
  payments?: PaymentIntent[];
}
