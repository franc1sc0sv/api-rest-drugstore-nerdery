import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductModel } from './product.model';
import { CartItem } from '@prisma/client';

@ObjectType()
export class CartItemModel implements Partial<CartItem> {
  @Field(() => String)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  cartId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => ProductModel)
  product?: ProductModel;
}
