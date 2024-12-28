import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { UploadProductImageInput } from './upload-product-images.input';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido.' })
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es requerida.' })
  description: string;

  @Field()
  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
  price: number;

  @Field()
  @IsNumber()
  @Min(0, { message: 'El stock debe ser mayor o igual a 0.' })
  stock: number;

  @Field()
  @IsString()
  categoryId: string;

  @Field(() => [UploadProductImageInput])
  @IsNotEmpty({ message: 'Las imágenes son requeridas.' })
  images: UploadProductImageInput[];
}
