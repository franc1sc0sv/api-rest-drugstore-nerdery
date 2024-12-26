import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class UpdateProductStatusInput {
  @Field()
  @IsBoolean()
  isDisabled: boolean;
}
