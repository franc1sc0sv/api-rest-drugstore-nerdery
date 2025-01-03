import { ObjectType, Field } from '@nestjs/graphql';
import { CartItemDto } from './cart-item.model';

@ObjectType()
export class CartDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => [CartItemDto])
  cartItems: CartItemDto[];
}
