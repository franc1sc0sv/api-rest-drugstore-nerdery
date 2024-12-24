import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageRequestDto {
  @IsString({ message: 'El ID público debe ser una cadena.' })
  @IsNotEmpty({ message: 'El ID público es requerido.' })
  publicId: string;
}
