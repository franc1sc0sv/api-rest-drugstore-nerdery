import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let prismaService: PrismaService;

  const mockRequest = {
    headers: {
      authorization: 'Bearer mockToken',
    },
  } as unknown as Request;

  const mockPayload = {
    userId: 'test-user-id',
  };

  const mockUser = {
    id: 'test-user-id',
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

  const mockRevokedToken = {
    id: 'revoked-token-id',
    userId: 'test-user-id',
    token: 'mockToken',
    createdAt: new Date(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') {
        return 'mock-secret';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('validate', () => {
    it('should return a user if validation is successful', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.revokedToken, 'findFirst')
        .mockResolvedValue(null);

      const result = await jwtStrategy.validate(mockRequest, mockPayload);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: mockPayload.userId },
      });
      expect(prismaService.revokedToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockPayload.userId,
          token: 'mockToken',
        },
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        jwtStrategy.validate(mockRequest, mockPayload),
      ).rejects.toThrow(new UnauthorizedException('User not found'));
    });

    it('should throw UnauthorizedException if token is revoked', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.revokedToken, 'findFirst')
        .mockResolvedValue(mockRevokedToken);

      await expect(
        jwtStrategy.validate(mockRequest, mockPayload),
      ).rejects.toThrow(new UnauthorizedException('Token has been revoked'));
    });
  });
});
