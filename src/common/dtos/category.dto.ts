import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CategoryResponse implements Partial<Category> {
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