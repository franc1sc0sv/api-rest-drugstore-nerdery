import { ObjectType, Field } from '@nestjs/graphql';
import { CartItemModel } from './cart-item.model';
import { Cart } from '@prisma/client';

@ObjectType()
export class CartModel implements Partial<Cart> {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => [CartItemModel])
  cartItems?: CartItemModel[];
}
