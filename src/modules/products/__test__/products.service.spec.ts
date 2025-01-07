import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ProductsService } from '../products.service';
import { ImagesService } from '../../images/images.service';
import { NotFoundException } from '@nestjs/common';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';

const mockProducts = [
  {
    id: 'product-1',
    name: 'Product 1',
    description: 'Description for product 1',
    price: 100.0,
    stock: 50,
    isDisabled: false,
    lowStockNotified: false,
    categoryId: 'category-1',
    category: null,
    images: [],
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  },
  {
    id: 'product-2',
    name: 'Product 2',
    description: 'Description for product 2',
    price: 200.0,
    stock: 30,
    isDisabled: false,
    lowStockNotified: false,
    categoryId: 'category-2',
    category: null,
    images: [],
    createdAt: new Date('2023-01-02T00:00:00.000Z'),
    updatedAt: new Date('2023-01-03T00:00:00.000Z'),
  },
  {
    id: 'product-3',
    name: 'Test Product 3',
    description: 'Description for product 3',
    price: 300.0,
    stock: 20,
    isDisabled: true,
    lowStockNotified: true,
    categoryId: 'category-3',
    category: null,
    images: [],
    createdAt: new Date('2023-01-03T00:00:00.000Z'),
    updatedAt: new Date('2023-01-04T00:00:00.000Z'),
  },
];

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
    it('should retrieve all products without filters', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce(mockProducts);

      const result = await productsService.getProducts({ first: 3 });

      expect(result.edges).toHaveLength(3);
      expect(result.pageInfo.hasNextPage).toBe(false);
      expect(result.pageInfo.hasPreviousPage).toBe(false);
    });

    it('should retrieve products after a specific cursor', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce([
        mockProducts[1],
        mockProducts[2],
      ]);

      const result = await productsService.getProducts({
        first: 2,
        after: '2023-01-01T00:00:00.000Z',
      });

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].node.name).toBe('Product 2');
      expect(result.pageInfo.hasNextPage).toBe(false);
    });

    it('should retrieve products before a specific cursor', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce([
        mockProducts[0],
      ]);

      const result = await productsService.getProducts({
        first: 1,
        before: '2023-01-02T00:00:00.000Z',
      });

      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].node.name).toBe('Product 1');
      expect(result.pageInfo.hasPreviousPage).toBe(false);
    });

    it('should retrieve products filtered by category', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce([
        mockProducts[0],
        mockProducts[2],
      ]);

      const result = await productsService.getProducts({
        first: 2,
        categoryId: 'category-1',
      });

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].node.categoryId).toBe('category-1');
    });

    it('should handle pagination with hasNextPage and hasPreviousPage', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce([
        mockProducts[0],
        mockProducts[1],
      ]);
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[2],
      );
      mockPrismaService.product.findFirst.mockResolvedValueOnce(
        mockProducts[0],
      );

      const result = await productsService.getProducts({
        first: 2,
      });

      expect(result.pageInfo.hasNextPage).toBe(true);
      expect(result.pageInfo.hasPreviousPage).toBe(true);
    });

    it('should return empty edges when no products are found', async () => {
      mockPrismaService.product.findMany.mockResolvedValueOnce([]);

      const result = await productsService.getProducts({ first: 2 });

      expect(result.edges).toHaveLength(0);
      expect(result.pageInfo.hasNextPage).toBe(false);
      expect(result.pageInfo.hasPreviousPage).toBe(false);
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
