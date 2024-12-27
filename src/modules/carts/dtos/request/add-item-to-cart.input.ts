import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

@InputType()
export class AddItemToCartInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
