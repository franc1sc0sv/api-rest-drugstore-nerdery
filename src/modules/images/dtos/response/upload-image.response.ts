import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadImageResponseResponse {
  @Field()
  publicId: string;

  @Field()
  url: string;
}
