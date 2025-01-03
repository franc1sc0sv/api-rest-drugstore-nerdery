import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../images.service';

/// Cloudinary service

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
  });

  describe('deleteImage', () => {
    it('should be defined', () => {
      expect(imagesService.deleteImage).toBeDefined();
    });
  });
});
