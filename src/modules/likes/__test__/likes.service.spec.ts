import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { LikesService } from '../likes.service';

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
  });

  describe('likeProduct', () => {
    it('should be defined', () => {
      expect(likesService.likeProduct).toBeDefined();
    });
  });

  describe('deleteLike', () => {
    it('should be defined', () => {
      expect(likesService.deleteLike).toBeDefined();
    });
  });

  describe('getUserLikes', () => {
    it('should be defined', () => {
      expect(likesService.getUserLikes).toBeDefined();
    });
  });
});
