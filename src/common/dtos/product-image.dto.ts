import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductImage {
  @Field()
  url: string;

  @Field()
  productId: string;

  @Field()
  cloudinaryPublicId: string;
}
