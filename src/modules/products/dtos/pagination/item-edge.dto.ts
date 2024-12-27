import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDto } from 'src/common/dtos/product.dto';

@ObjectType()
export class ItemEdgeDto {
  @Field(() => ProductDto)
  node: ProductDto;

  @Field()
  cursor: string;
}
