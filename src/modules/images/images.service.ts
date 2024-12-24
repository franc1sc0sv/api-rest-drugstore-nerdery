import { Inject, Injectable } from '@nestjs/common';
import { UploadImageResponseDto } from './dtos/response/upload-image.dto';
import { UploadImageInput } from './dtos/request/upload-image.input';
import { DeleteImageRequestDto } from './dtos/request/delete-image.input';

@Injectable()
export class ImagesService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(
    uploadImageInput: UploadImageInput,
  ): Promise<UploadImageResponseDto> {
    const { fileBuffer: buffer, folder } = uploadImageInput;

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(buffer);
    });
  }

  async deleteImage(
    deleteImageRequestDto: DeleteImageRequestDto,
  ): Promise<{ result: string }> {
    const { publicId } = deleteImageRequestDto;
    return this.cloudinary.uploader.destroy(publicId);
  }
}
