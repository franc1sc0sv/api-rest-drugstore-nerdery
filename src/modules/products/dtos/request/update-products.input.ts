import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsUUID,
  IsOptional,
} from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido.' })
  @IsOptional()
  name?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es requerida.' })
  @IsOptional()
  description?: string;

  @Field()
  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
  @IsOptional()
  price?: number;

  @Field()
  @IsNumber()
  @Min(0, { message: 'El stock debe ser mayor o igual a 0.' })
  @IsOptional()
  stock?: number;

  @Field()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido.' })
  @IsOptional()
  categoryId?: string;
}
