// order-item.type.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDto } from './product.dto';

@ObjectType()
export class OrderItem {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field(() => ProductDto)
  product: ProductDto;

  @Field()
  quantity: number;

  @Field()
  orderId: string;
}
