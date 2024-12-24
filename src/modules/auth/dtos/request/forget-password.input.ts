import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ForgetPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}
