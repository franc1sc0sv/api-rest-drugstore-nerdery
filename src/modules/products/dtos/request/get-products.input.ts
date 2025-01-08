import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class GetProductsInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsInt()
  @Min(1, { message: 'El valor mínimo para "pageSize" es 1' })
  pageSize: number = 10;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El valor mínimo para "page" es 1' })
  page: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'El categoryId debe ser un string válido' })
  categoryId?: string;
}
