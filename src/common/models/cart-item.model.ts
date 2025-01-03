import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductModel } from './product.model';

@ObjectType()
export class CartItemModel implements Partial<CartItemModel> {
  @Field(() => String)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => ProductModel)
  product: ProductModel;
}
