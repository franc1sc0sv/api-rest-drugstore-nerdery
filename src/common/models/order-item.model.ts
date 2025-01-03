// order-item.type.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { ProductModel } from './product.model';
import { OrderItem } from '@prisma/client';

@ObjectType()
export class OrderItemModel implements Partial<OrderItem> {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field(() => ProductModel)
  product: ProductModel;

  @Field()
  quantity: number;

  @Field()
  orderId: string;
}
