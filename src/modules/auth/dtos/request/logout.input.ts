import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LogoutRequestDto {
  @Field()
  @IsString()
  token: string;
}
