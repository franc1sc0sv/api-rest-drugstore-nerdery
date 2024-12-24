import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class ForgetPasswordResponseDto {
  @Field()
  @IsString()
  message: string;
}
