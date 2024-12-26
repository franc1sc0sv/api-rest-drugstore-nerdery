import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Product } from '@prisma/client';

@ObjectType()
export class ProductDto implements Partial<Product> {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  stock: number;

  @Field()
  isDisabled: boolean;

  @Field()
  lowStockNotified: boolean;

  @Field()
  categoryId: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
