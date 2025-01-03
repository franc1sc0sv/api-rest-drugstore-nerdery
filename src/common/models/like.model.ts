import { ObjectType, Field } from '@nestjs/graphql';
import { ProductModel } from './product.model';
import { Like } from '@prisma/client';

@ObjectType()
export class LikeModel implements Partial<Like> {
  @Field(() => String)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => ProductModel)
  product: ProductModel;
}
