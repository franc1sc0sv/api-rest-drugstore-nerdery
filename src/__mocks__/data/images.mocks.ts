import { faker } from '@faker-js/faker';
import { UploadApiResponse } from 'cloudinary';
import { DeleteImageRequestDto } from 'src/modules/images/dtos/request/delete-image.input';
import { UploadImageInput } from 'src/modules/images/dtos/request/upload-image.input';
import { UploadImageResponseDto } from 'src/modules/images/dtos/response/upload-image.dto';

export const mockUploadImageInput: UploadImageInput = {
  fileBuffer: faker.image.dataUri(),
  folder: faker.lorem.word(),
};

export const mockUploadResponseCloudinary: Partial<UploadApiResponse> = {
  secure_url: faker.internet.url(),
  public_id: faker.string.uuid(),
};
export const mockUploadResponse: UploadImageResponseDto = {
  url: mockUploadResponseCloudinary.secure_url,
  publicId: mockUploadResponseCloudinary.public_id,
};

export const mockDeleteImageRequestDto: DeleteImageRequestDto = {
  publicId: faker.string.uuid(),
};
