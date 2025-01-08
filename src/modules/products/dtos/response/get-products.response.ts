import { Field, ObjectType } from '@nestjs/graphql';
import { ProductModel } from 'src/common/models/product.model';

@ObjectType()
export class GetProductsResponse {
  @Field()
  data: ProductModel[];
  @Field()
  totalPages: number;
  @Field()
  currentPage: number;
}
