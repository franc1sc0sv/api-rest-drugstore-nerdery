import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { CategoryModel } from './category.model';
import { ProductImageModel } from './product-image.model';

@ObjectType()
export class ProductModel implements Partial<Product> {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  stock?: number;

  @Field()
  isDisabled?: boolean;

  @Field()
  lowStockNotified?: boolean;

  @Field()
  categoryId: string;

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel;

  @Field(() => [ProductImageModel], { nullable: true })
  images?: ProductImageModel[];

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
