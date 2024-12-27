import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDto } from './product.dto';

@ObjectType()
export class LikeDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => ProductDto)
  product: ProductDto;
}
