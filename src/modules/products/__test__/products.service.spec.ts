import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ProductsService } from '../products.service';
import { ImagesService } from '../../images/images.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import {
  mockPage,
  mockPageSize,
  mockProducts,
} from '../../../__mocks__/data/product.mocks';

const mockImageService = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
};

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ImagesService, useValue: mockImageService },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should retrieve products for the first page', async () => {
      const paginatedProducts = mockProducts.slice(0, mockPageSize);

      mockPrismaService.product.findMany.mockResolvedValueOnce(
        paginatedProducts,
      );
      mockPrismaService.product.count.mockResolvedValueOnce(
        mockProducts.length,
      );

      const result = await productsService.getProducts({
        page: mockPage,
        pageSize: mockPageSize,
      });

      expect(result.data).toHaveLength(mockPageSize);
      expect(result.currentPage).toBe(mockPage);
      expect(result.totalPages).toBe(
        Math.ceil(mockProducts.length / mockPageSize),
      );
    });

    it('should retrieve products for a specific page', async () => {
      const startIndex = (mockPage - 1) * mockPageSize;
      const paginatedProducts = mockProducts.slice(
        startIndex,
        startIndex + mockPageSize,
      );

      mockPrismaService.product.findMany.mockResolvedValueOnce(
        paginatedProducts,
      );
      mockPrismaService.product.count.mockResolvedValueOnce(
        mockProducts.length,
      );

      const result = await productsService.getProducts({
        page: mockPage,
        pageSize: mockPageSize,
      });

      expect(result.data).toHaveLength(mockPageSize);
      expect(result.currentPage).toBe(mockPage);
      expect(result.totalPages).toBe(
        Math.ceil(mockProducts.length / mockPageSize),
      );
    });

    it('should retrieve products filtered by category', async () => {
      const mockCategoryId = mockProducts[0].categoryId;
      const filteredProducts = mockProducts.filter(
        (p) => p.categoryId === mockCategoryId,
      );

      mockPrismaService.product.findMany.mockResolvedValueOnce(
        filteredProducts.slice(0, mockPageSize),
      );
      mockPrismaService.product.count.mockResolvedValueOnce(
        filteredProducts.length,
      );

      const result = await productsService.getProducts({
        page: mockPage,
        pageSize: mockPageSize,
        categoryId: mockCategoryId,
      });

      expect(result.data).toHaveLength(
        Math.min(mockPageSize, filteredProducts.length),
      );
      expect(result.currentPage).toBe(mockPage);
      expect(result.totalPages).toBe(
        Math.ceil(filteredProducts.length / mockPageSize),
      );
      expect(result.data.every((p) => p.categoryId === mockCategoryId)).toBe(
        true,
      );
    });

    it('should return an empty result for a page with no products', async () => {
      const totalPages = Math.ceil(mockProducts.length / mockPageSize);

      mockPrismaService.product.findMany.mockResolvedValueOnce([]);
      mockPrismaService.product.count.mockResolvedValueOnce(
        mockProducts.length,
      );

      const result = await productsService.getProducts({
        page: mockPage,
        pageSize: mockPageSize,
      });

      expect(result.data).toHaveLength(0);
      expect(result.currentPage).toBe(mockPage);
      expect(result.totalPages).toBe(totalPages);
    });

    it('should handle dynamic page and pageSize values', async () => {
      const startIndex = (mockPage - 1) * mockPageSize;
      const paginatedProducts = mockProducts.slice(
        startIndex,
        startIndex + mockPageSize,
      );

      mockPrismaService.product.findMany.mockResolvedValueOnce(
        paginatedProducts,
      );
      mockPrismaService.product.count.mockResolvedValueOnce(
        mockProducts.length,
      );

      const result = await productsService.getProducts({
        page: mockPage,
        pageSize: mockPageSize,
      });

      expect(result.data).toHaveLength(paginatedProducts.length);
      expect(result.currentPage).toBe(mockPage);
      expect(result.totalPages).toBe(
        Math.ceil(mockProducts.length / mockPageSize),
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product with images', async () => {
      const uploadedImage = {
        publicId: 'cloudinary-1',
        url: 'https://example.com/image1.jpg',
      };
      mockImageService.uploadImage.mockResolvedValueOnce(uploadedImage);
      mockPrismaService.product.create.mockResolvedValueOnce(mockProducts[0]);

      const result = await productsService.createProduct({
        name: 'Test Product 1',
        description: 'Description for product 1',
        price: 100.0,
        categoryId: 'category-1',
        images: [{ fileBuffer: Buffer.from('image-data').toString('base64') }],
        stock: 1,
      });

      expect(result).toEqual(mockProducts[0]);
      expect(imagesService.uploadImage).toHaveBeenCalledTimes(1);
      expect(prismaService.product.create).toHaveBeenCalled();
    });

    it('should create a product without images', async () => {
      mockPrismaService.product.create.mockResolvedValueOnce(mockProducts[0]);

      const result = await productsService.createProduct({
        name: 'Test Product 1',
        description: 'Description for product 1',
        price: 100.0,
        categoryId: 'category-1',
        images: [],
        stock: 50,
      });

      expect(result).toEqual(mockProducts[0]);
      expect(imagesService.uploadImage).not.toHaveBeenCalled();
      expect(prismaService.product.create).toHaveBeenCalled();
    });
  });

  describe('addImagesToProduct', () => {
    it('should add images to a product', async () => {
      mockPrismaService.product.findFirst
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce({
          ...mockProducts[0],
          images: [
            {
              id: 'image-1',
              url: 'https://example.com/image2.jpg',
              cloudinaryPublicId: 'cloudinary-2',
              productId: 'product-1',
            },
          ],
        });

      const uploadedImage = {
        publicId: 'cloudinary-2',
        url: 'https://example.com/image2.jpg',
      };

      mockImageService.uploadImage.mockResolvedValueOnce(uploadedImage);
      mockPrismaService.productImage.createMany.mockResolvedValueOnce(null);

      const result = await productsService.addImagesToProduct(
        { id: 'product-1' },
        [{ fileBuffer: Buffer.from('image-data').toString('base64') }],
      );

      expect(result).toEqual({
        ...mockProducts[0],
        images: [
          {
            id: 'image-1',
            url: 'https://example.com/image2.jpg',
            cloudinaryPublicId: 'cloudinary-2',
            productId: 'product-1',
          },
        ],
      });
      expect(imagesService.uploadImage).toHaveBeenCalledTimes(1);
      expect(prismaService.productImage.createMany).toHaveBeenCalledWith({
        data: [
          {
            productId: 'product-1',
            cloudinaryPublicId: uploadedImage.publicId,
            url: uploadedImage.url,
          },
        ],
      });
    });

    it('should throw if product not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        productsService.addImagesToProduct({ id: 'product-1' }, [
          { fileBuffer: Buffer.from('image-data').toString('base64') },
        ]),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeImageFromProduct', () => {
    it('should remove an image from a product', async () => {
      mockPrismaService.productImage.findFirst.mockResolvedValueOnce({
        id: 'image-1',
        cloudinaryPublicId: 'cloudinary-1',
      });
      mockPrismaService.productImage.delete.mockResolvedValueOnce(null);

      const result = await productsService.removeImageFromProduct(
        { id: 'product-1' },
        { id: 'image-1' },
      );

      expect(result).toBe(true);
      expect(imagesService.deleteImage).toHaveBeenCalledWith({
        publicId: 'cloudinary-1',
      });
      expect(prismaService.productImage.delete).toHaveBeenCalled();
    });

    it('should throw if image not found', async () => {
      mockPrismaService.productImage.findFirst.mockResolvedValueOnce(null);

      await expect(
        productsService.removeImageFromProduct(
          { id: 'product-1' },
          { id: 'image-1' },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and its images', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[0],
      );
      mockPrismaService.productImage.findMany.mockResolvedValueOnce(
        mockProducts[0].images,
      );
      mockPrismaService.product.delete.mockResolvedValueOnce(null);

      const deleteImageMock = jest
        .spyOn(imagesService, 'deleteImage')
        .mockResolvedValueOnce(true);

      const result = await productsService.deleteProduct({ id: 'product-1' });

      expect(result).toBe(true);

      expect(deleteImageMock).toHaveBeenCalledTimes(
        mockProducts[0].images.length,
      );
      mockProducts[0].images.forEach((image, index) => {
        expect(deleteImageMock).toHaveBeenCalledWith({
          publicId: image.cloudinaryPublicId,
        });
      });

      expect(prismaService.productImage.deleteMany).toHaveBeenCalledWith({
        where: { productId: 'product-1' },
      });

      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 'product-1' },
      });
    });
  });

  describe('getProductById', () => {
    it('should return the product if it exists', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[0],
      );

      const result = await productsService.getProductById({ id: 'product-1' });

      expect(result).toEqual(mockProducts[0]);
      expect(prismaService.product.findFirst).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        include: { images: true },
      });
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        productsService.getProductById({ id: 'non-existent-id' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProductDetails', () => {
    it('should update and return the product details', async () => {
      const updatedProduct = { ...mockProducts[0], name: 'Updated Product' };
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[0],
      );
      mockPrismaService.product.update.mockResolvedValueOnce(updatedProduct);

      const result = await productsService.updateProductDetails(
        { id: 'product-1' },
        { name: 'Updated Product' },
      );

      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { name: 'Updated Product' },
        include: { images: true },
      });
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        productsService.updateProductDetails(
          { id: 'non-existent-id' },
          { name: 'Updated Product' },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProductStatus', () => {
    it('should update and return the product status', async () => {
      const updatedProduct = { ...mockProducts[0], isDisabled: true };
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[0],
      );
      mockPrismaService.product.update.mockResolvedValueOnce(updatedProduct);

      const result = await productsService.updateProductStatus(
        { id: 'product-1' },
        { isDisabled: true },
      );

      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { isDisabled: true },
        include: { images: true },
      });
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      mockPrismaService.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        productsService.updateProductStatus(
          { id: 'non-existent-id' },
          { isDisabled: true },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
