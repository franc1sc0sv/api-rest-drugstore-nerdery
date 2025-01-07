import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from '../likes.service';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { NotFoundException } from '@nestjs/common';
import { LikeModel } from 'src/common/models/like.model';
import { IdDto } from 'src/common/dtos/id.dto';
import { UserModel } from 'src/common/models/user.model';
import { Role } from '@prisma/client';

const fixedUserId = 'user-12345';
const fixedProductId = 'product-12345';
const fixedLikeId = 'like-12345';

const user: UserModel = {
  id: fixedUserId,
  email: 'test@example.com',
  password: 'hashedPassword',
  name: 'Test User',
  role: Role.CLIENT,
  resetToken: null,
  resetTokenExpiry: null,
  stripeCustomerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('LikesService', () => {
  let likesService: LikesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    likesService = module.get<LikesService>(LikesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('likeProduct', () => {
    it('should be defined', () => {
      expect(likesService.likeProduct).toBeDefined();
    });

    it('should throw an error if the user already likes the product', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue({
        id: fixedLikeId,
        productId: fixedProductId,
        userId: fixedUserId,
      });

      try {
        await likesService.likeProduct({ id: fixedProductId } as IdDto, user);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('User has already liked this product');
      }
    });

    it('should create a new like for a product', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValueOnce(null);

      prismaService.like.create = jest.fn().mockResolvedValue({
        id: fixedLikeId,
        productId: fixedProductId,
        userId: fixedUserId,
        product: {},
      });

      const result = await likesService.likeProduct(
        { id: fixedProductId } as IdDto,
        user,
      );

      expect(prismaService.like.create).toHaveBeenCalledWith({
        data: {
          productId: fixedProductId,
          userId: fixedUserId,
        },
        include: { product: true },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(fixedLikeId);
      expect(result.productId).toBe(fixedProductId);
    });
  });

  describe('deleteLike', () => {
    it('should be defined', () => {
      expect(likesService.deleteLike).toBeDefined();
    });

    it('should throw NotFoundException if like does not exist', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue(null);

      try {
        await likesService.deleteLike({ id: fixedProductId } as IdDto, user);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Like not found');
      }
    });

    it('should delete the like and return true', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue({
        id: fixedLikeId,
        productId: fixedProductId,
        userId: fixedUserId,
      });

      prismaService.like.delete = jest.fn().mockResolvedValue({});

      const result = await likesService.deleteLike(
        { id: fixedProductId } as IdDto,
        user,
      );
      expect(result).toBe(true);
      expect(prismaService.like.delete).toHaveBeenCalledWith({
        where: { id: fixedLikeId },
      });
    });
  });

  describe('getUserLikes', () => {
    it('should be defined', () => {
      expect(likesService.getUserLikes).toBeDefined();
    });

    it('should return user likes', async () => {
      const mockLikes: LikeModel[] = [
        {
          id: fixedLikeId,
          productId: fixedProductId,
          userId: fixedUserId,
          product: {
            id: 'produc-123',
            categoryId: 'category-123',
            description: 'a',
            name: 'aa',
            price: 12,
          },
          createdAt: new Date(),
        },
      ];

      prismaService.like.findMany = jest.fn().mockResolvedValueOnce(mockLikes);

      const result = await likesService.getUserLikes(user);
      expect(result).toEqual(mockLikes);
    });

    it('should throw NotFoundException if no likes are found', async () => {
      prismaService.like.findMany = jest.fn().mockResolvedValueOnce([]);

      try {
        await likesService.getUserLikes(user);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('No likes found for the user');
      }
    });
  });
});
