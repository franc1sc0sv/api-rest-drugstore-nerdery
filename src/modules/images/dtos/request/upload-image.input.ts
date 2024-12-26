import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsBase64Image } from 'src/common/decorators/IsBase64Image.decorator';

@InputType()
export class UploadImageInput {
  @Field()
  @IsNotEmpty({ message: 'El buffer de la imagen es requerido.' })
  @IsBase64Image()
  fileBuffer: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre de la carpeta debe ser una cadena.' })
  folder: string;
}
