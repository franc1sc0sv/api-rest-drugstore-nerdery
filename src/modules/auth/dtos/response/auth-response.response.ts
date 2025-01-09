import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class AuthResponse {
  @Field()
  @IsString()
  token: string;
}
