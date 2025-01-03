import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { ProductsService } from '../products.service';
import { ImagesService } from '../../images/images.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ImagesService,
          useValue: {},
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('getProducts', () => {
    it('should be defined', () => {
      expect(productsService.getProducts).toBeDefined();
    });
  });

  describe('createProduct', () => {
    it('should be defined', () => {
      expect(productsService.createProduct).toBeDefined();
    });
  });

  describe('addImagesToProduct', () => {
    it('should be defined', () => {
      expect(productsService.addImagesToProduct).toBeDefined();
    });
  });

  describe('removeImageFromProduct', () => {
    it('should be defined', () => {
      expect(productsService.removeImageFromProduct).toBeDefined();
    });
  });

  describe('getProductById', () => {
    it('should be defined', () => {
      expect(productsService.getProductById).toBeDefined();
    });
  });

  describe('updateProductDetails', () => {
    it('should be defined', () => {
      expect(productsService.updateProductDetails).toBeDefined();
    });
  });

  describe('deleteProduct', () => {
    it('should be defined', () => {
      expect(productsService.deleteProduct).toBeDefined();
    });
  });

  describe('updateProductStatus', () => {
    it('should be defined', () => {
      expect(productsService.updateProductStatus).toBeDefined();
    });
  });
});
