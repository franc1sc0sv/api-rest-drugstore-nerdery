import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from '../likes.service';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { NotFoundException } from '@nestjs/common';

import { mockLike, mockLikes } from '../../../__mocks__/data/likes.mocks';
import { mockUser } from '../../../__mocks__/data/user.mocks';

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
    it('should throw an error if the user already likes the product', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue(mockLike);

      try {
        await likesService.likeProduct({ id: mockLike.productId }, mockUser);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('User has already liked this product');
      }
    });

    it('should create a new like for a product', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValueOnce(null);

      prismaService.like.create = jest.fn().mockResolvedValue(mockLike);

      const result = await likesService.likeProduct(
        { id: mockLike.productId },
        mockUser,
      );

      expect(prismaService.like.create).toHaveBeenCalledWith({
        data: {
          productId: mockLike.productId,
          userId: mockUser.id,
        },
        include: { product: true },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockLike.id);
      expect(result.productId).toBe(mockLike.productId);
    });
  });

  describe('deleteLike', () => {
    it('should throw NotFoundException if like does not exist', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue(null);

      try {
        await likesService.likeProduct({ id: mockLike.productId }, mockUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Like not found');
      }
    });

    it('should delete the like and return true', async () => {
      prismaService.like.findFirst = jest.fn().mockResolvedValue(mockLike);

      prismaService.like.delete = jest.fn().mockResolvedValue(mockLike);

      const result = await likesService.deleteLike(
        { id: mockLike.productId },
        mockUser,
      );

      expect(result).toBe(true);
      expect(prismaService.like.delete).toHaveBeenCalledWith({
        where: { id: mockLike.id },
      });
    });
  });

  describe('getUserLikes', () => {
    it('should be defined', () => {
      expect(likesService.getUserLikes).toBeDefined();
    });

    it('should return user likes', async () => {
      prismaService.like.findMany = jest.fn().mockResolvedValueOnce(mockLikes);

      const result = await likesService.getUserLikes(mockUser);
      expect(result).toEqual(mockLikes);
    });

    it('should throw NotFoundException if no likes are found', async () => {
      prismaService.like.findMany = jest.fn().mockResolvedValueOnce([]);

      try {
        await likesService.getUserLikes(mockUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('No likes found for the user');
      }
    });
  });
});
