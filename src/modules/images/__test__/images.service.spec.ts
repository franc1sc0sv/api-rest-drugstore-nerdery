import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../images.service';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadImageInput } from '../dtos/request/upload-image.input';
import { DeleteImageRequestDto } from '../dtos/request/delete-image.input';

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
    it('should be defined', () => {
      expect(imagesService.uploadImage).toBeDefined();
    });

    it('should successfully upload an image', async () => {
      const uploadImageInput: UploadImageInput = {
        fileBuffer: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        folder: 'test-folder',
      };

      const mockUploadResponse = {
        secure_url: 'https://example.com/image.png',
        public_id: 'image_public_id',
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockUploadResponse);
        },
      );

      const result = await imagesService.uploadImage(uploadImageInput);

      expect(result).toEqual({
        url: 'https://example.com/image.png',
        publicId: 'image_public_id',
      });
    });

    it('should throw InternalServerErrorException if upload fails', async () => {
      const uploadImageInput: UploadImageInput = {
        fileBuffer: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        folder: 'test-folder',
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(new InternalServerErrorException('Upload error'), null);
        },
      );

      await expect(imagesService.uploadImage(uploadImageInput)).rejects.toThrow(
        new InternalServerErrorException('Failed to upload image.'),
      );
    });

    it('should throw InternalServerErrorException if there is an unexpected error', async () => {
      const uploadImageInput: UploadImageInput = {
        fileBuffer: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        folder: 'test-folder',
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          throw new Error('Unexpected error');
        },
      );

      await expect(imagesService.uploadImage(uploadImageInput)).rejects.toThrow(
        new InternalServerErrorException(
          'Failed to upload image.',
          expect.any(Error),
        ),
      );
    });
  });

  describe('deleteImage', () => {
    it('should be defined', () => {
      expect(imagesService.deleteImage).toBeDefined();
    });

    it('should successfully delete an image', async () => {
      const deleteImageRequestDto: DeleteImageRequestDto = {
        publicId: 'image_public_id',
      };

      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: 'ok',
      });

      const result = await imagesService.deleteImage(deleteImageRequestDto);

      expect(result).toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        'image_public_id',
      );
    });

    it('should throw BadRequestException if delete fails', async () => {
      const deleteImageRequestDto: DeleteImageRequestDto = {
        publicId: 'image_public_id',
      };

      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
        new Error('Cloudinary error'),
      );

      await expect(
        imagesService.deleteImage(deleteImageRequestDto),
      ).rejects.toThrow(
        new BadRequestException('Cloudinary error: Cloudinary error'),
      );
    });
  });
});
