import { Field, ObjectType } from '@nestjs/graphql';
import { ProductImage } from '@prisma/client';

@ObjectType()
export class ProductImageModel implements Partial<ProductImage> {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  productId: string;

  @Field()
  cloudinaryPublicId: string;
}
