import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CategoryResponse {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  parentId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => CategoryResponse, { nullable: true })
  parent?: CategoryResponse;

  @Field(() => [CategoryResponse])
  @IsOptional()
  subCategories: CategoryResponse[];
}
