import { ObjectType, Field } from '@nestjs/graphql';
import { ItemEdgeDto } from './item-edge.dto';
import { PageInfoDto } from './page-info.dto';

@ObjectType()
export class ItemConnectionDto {
  @Field(() => [ItemEdgeDto])
  edges: ItemEdgeDto[];

  @Field(() => PageInfoDto)
  pageInfo: PageInfoDto;
}
