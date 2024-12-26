import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteImageRequestDto {
  @Field()
  @IsString({ message: 'El ID público debe ser una cadena válida.' })
  @IsNotEmpty({ message: 'El ID público es requerido.' })
  publicId: string;
}
