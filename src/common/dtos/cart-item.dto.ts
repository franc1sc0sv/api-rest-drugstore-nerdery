import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductDto } from './product.dto';

@ObjectType()
export class CartItemDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => ProductDto)
  product: ProductDto;
}
