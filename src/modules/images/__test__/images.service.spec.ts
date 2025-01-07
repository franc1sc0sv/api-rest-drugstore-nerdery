import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../images.service';
import { InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import {
  mockDeleteImageRequestDto,
  mockUploadImageInput,
  mockUploadResponse,
  mockUploadResponseCloudinary,
} from '../../../__mocks__/data/images.mocks';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('ImagesService', () => {
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
  });

  describe('uploadImage', () => {
    it('should successfully upload an image', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockUploadResponseCloudinary);
        },
      );

      const result = await imagesService.uploadImage(mockUploadImageInput);

      expect(result).toEqual(mockUploadResponse);
    });

    it('should throw InternalServerErrorException if upload fails', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(new InternalServerErrorException('Upload error'), null);
        },
      );

      await expect(
        imagesService.uploadImage(mockUploadImageInput),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to upload image.'),
      );
    });

    it('should throw InternalServerErrorException if there is an unexpected error', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          throw new InternalServerErrorException('Failed to upload image.');
        },
      );

      await expect(
        imagesService.uploadImage(mockUploadImageInput),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Failed to upload image.',
          expect.any(Error),
        ),
      );
    });
  });

  describe('deleteImage', () => {
    it('should successfully delete an image', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: 'ok',
      });

      const result = await imagesService.deleteImage(mockDeleteImageRequestDto);

      expect(result).toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        mockDeleteImageRequestDto.publicId,
      );
    });

    it('should throw BadRequestException if delete fails', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
        new InternalServerErrorException('Failed to upload image.'),
      );

      await expect(
        imagesService.deleteImage(mockDeleteImageRequestDto),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Cloudinary error: Failed to upload image.',
        ),
      );
    });
  });
});
