import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsBase64Image } from 'src/common/decorators/IsBase64Image.decorator';

@InputType()
export class UploadProductImageInput {
  @Field()
  @IsString({ message: 'The fileBuffer must be a Base64-encoded string.' })
  @IsNotEmpty({ message: 'The fileBuffer is required.' })
  @IsBase64Image()
  fileBuffer: string;
}
