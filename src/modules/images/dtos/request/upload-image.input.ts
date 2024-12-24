import { IsNotEmpty, IsString } from 'class-validator';
import { IsBuffer } from 'src/common/decorators/isBuffer.decorator';

export class UploadImageInput {
  @IsBuffer()
  @IsNotEmpty({ message: 'El buffer de la imagen es requerido.' })
  fileBuffer: Buffer;

  @IsString({ message: 'El nombre de la carpeta debe ser una cadena.' })
  @IsNotEmpty({ message: 'La carpeta de destino es requerida.' })
  folder: string;
}
