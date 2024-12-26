import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadImageResponseDto {
  @Field()
  publicId: string;

  @Field()
  url: string;
}
