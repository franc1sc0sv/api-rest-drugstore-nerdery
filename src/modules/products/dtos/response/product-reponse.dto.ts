import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { ProductImage } from 'src/common/dtos/product-image.dto';

@ObjectType()
export class ProductResponse implements Partial<Product> {
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

  @Field(() => [ProductImage], { nullable: true })
  images?: ProductImage[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
