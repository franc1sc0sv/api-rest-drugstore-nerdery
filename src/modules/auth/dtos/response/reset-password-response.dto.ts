import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class ResetPasswordResponseDto {
  @Field()
  @IsString()
  message: string;
}
