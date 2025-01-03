import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDto } from 'src/common/models/product.model';

@ObjectType()
export class ItemEdgeDto {
  @Field(() => ProductDto)
  node: ProductDto;

  @Field()
  cursor: string;
}
