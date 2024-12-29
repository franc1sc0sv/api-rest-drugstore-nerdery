import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalCart {
  @Field()
  id: string;

  @Field()
  total: number;
}
