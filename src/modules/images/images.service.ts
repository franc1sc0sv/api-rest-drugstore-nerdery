import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadImageInput } from './dtos/request/upload-image.input';
import { UploadImageResponseDto } from './dtos/response/upload-image.dto';
import { DeleteImageRequestDto } from './dtos/request/delete-image.input';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class ImagesService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    uploadImageInput: UploadImageInput,
  ): Promise<UploadImageResponseDto> {
    const { fileBuffer, folder } = uploadImageInput;

    try {
      const base64Data = fileBuffer.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const result: Promise<UploadApiResponse> = new Promise(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder,
            },
            (error: UploadApiErrorResponse, result: UploadApiResponse) => {
              if (result) {
                resolve(result);
              }

              if (error) {
                reject(
                  new InternalServerErrorException(
                    'Failed to upload image to cloudinary.',
                  ),
                );
              }
            },
          );

          upload.end(buffer);
        },
      );

      return {
        url: (await result).secure_url,
        publicId: (await result).public_id,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image.', error);
    }
  }

  async deleteImage(
    deleteImageRequestDto: DeleteImageRequestDto,
  ): Promise<boolean> {
    try {
      const { publicId } = deleteImageRequestDto;

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new BadRequestException(`Cloudinary error: ${error.message}`);
    }
  }
}
