import { ObjectType, Field } from '@nestjs/graphql';
import { ProductModel } from 'src/common/models/product.model';

@ObjectType()
export class ItemEdgeDto {
  @Field(() => ProductModel)
  node: ProductModel;

  @Field()
  cursor: string;
}
