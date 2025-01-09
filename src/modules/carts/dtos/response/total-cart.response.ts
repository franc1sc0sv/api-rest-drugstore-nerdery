import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalCartResponse {
  @Field()
  id: string;

  @Field()
  total: number;
}
