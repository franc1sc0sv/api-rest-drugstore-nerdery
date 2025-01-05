import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUserInput } from '../dtos/request/login-user.input';
import { UserModel } from 'src/common/models/user.model';
import { PrismaService } from 'nestjs-prisma';
import { comparePassword } from '../../../common/utils/bcrypt.util';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';

jest.mock('../../../common/utils/bcrypt.util');

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  let prismaService: PrismaService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  const mockUser: UserModel = {
    id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: 'CLIENT',
    resetToken: null,
    resetTokenExpiry: null,
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('validate', () => {
    it('should return a user if validation is successful', async () => {
      const loginInput: LoginUserInput = {
        email: 'test@example.com',
        password: 'correctPassword',
      };

      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      authService.validateUser = jest.fn().mockResolvedValue(mockUser);

      const result = await localStrategy.validate(
        loginInput.email,
        loginInput.password,
      );

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(loginInput);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const loginInput: LoginUserInput = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      authService.validateUser = jest.fn().mockResolvedValue(null);

      await expect(
        localStrategy.validate(loginInput.email, loginInput.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginInput: LoginUserInput = {
        email: 'test@example.com',
        password: 'anyPassword',
      };

      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        localStrategy.validate(loginInput.email, loginInput.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
