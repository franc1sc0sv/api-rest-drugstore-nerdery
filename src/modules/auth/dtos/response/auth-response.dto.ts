import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class AuthResponseDto {
  @Field()
  @IsString()
  token: string;
}
