import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductImage {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  productId: string;

  @Field()
  cloudinaryPublicId: string;
}
