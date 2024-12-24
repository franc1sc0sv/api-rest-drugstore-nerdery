import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
} from 'class-validator';
import { Role, User } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'Available user roles',
});

@ObjectType()
export class UserDto implements Partial<User> {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => String)
  @IsEnum(Role)
  role: Role;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  resetToken?: string | null;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  resetTokenExpiry?: Date | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  stripeCustomerId?: string | null;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;

  @Field(() => Date)
  @IsDate()
  updatedAt: Date;
}
