import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CategoryDto implements Partial<Category> {
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

  @Field(() => CategoryDto, { nullable: true })
  parent?: CategoryDto;

  @Field(() => [CategoryDto])
  @IsOptional()
  subCategories?: CategoryDto[];
}
