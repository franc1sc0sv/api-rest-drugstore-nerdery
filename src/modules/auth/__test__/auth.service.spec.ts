import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';
import { PrismaService } from 'nestjs-prisma';
import { MailsService } from '../../mails/mails.service';

import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { mockJwtService } from '../../../__mocks__/jwt.service.mocks';
import { mockMailsService } from '../../../__mocks__/mails.service.mocks';

import { RegisterUserInput } from '../dtos/request/register-user.input';

import {
  comparePassword,
  hashPassword,
} from '../../../common/utils/bcrypt.util';
import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/common/dtos/user.dto';
import { Role } from '@prisma/client';

jest.mock('../../../common/utils/bcrypt.util', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mailsService: MailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailsService,
          useValue: mockMailsService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailsService = module.get<MailsService>(MailsService);
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authService.register).toBeDefined();
    });

    it('should register a new user successfully', async () => {
      const registerUserInput: RegisterUserInput = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User',
      };

      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue({
        id: randomUUID(),
        email: registerUserInput.email,
        name: registerUserInput.name,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register(registerUserInput);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: registerUserInput.email },
      });

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerUserInput.email,
          password: 'hashedPassword',
          name: registerUserInput.name,
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          email: registerUserInput.email,
          name: registerUserInput.name,
        }),
      );
    });

    it('should throw ConflictException if email is already registered', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        name: 'Existing User',
      });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'Test1234!',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      prismaService.user.findFirst = jest
        .fn()
        .mockRejectedValue(new Error('Unexpected Error'));

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'Test1234!',
          name: 'Test User',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should return a valid token', async () => {
      const mockUser: UserDto = {
        id: '123',
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

      const mockToken = 'valid-token';

      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: mockUser.id,
      });

      expect(result).toEqual({ token: mockToken });
    });
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'Test1234!',
      });

      expect(result).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'hashedPassword',
        }),
      );
    });

    it('should throw UnauthorizedException if email is incorrect', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        authService.validateUser({
          email: 'wrong@example.com',
          password: 'Test1234!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser({
          email: 'test@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      prismaService.revokedToken.create = jest.fn().mockResolvedValue(true);

      const result = await authService.logout('userId', 'token');
      expect(result).toBe(true);
    });
  });

  describe('forget', () => {
    it('should send a password reset email', async () => {
      prismaService.user.findFirst = jest
        .fn()
        .mockResolvedValue({ id: '123', email: 'test@example.com' });
      prismaService.user.update = jest.fn().mockResolvedValue({});
      mailsService.sendPasswordResetEmail = jest.fn().mockResolvedValue(true);

      const result = await authService.forget({ email: 'test@example.com' });

      expect(result).toBe(true);
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(mailsService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        authService.forget({ email: 'nonexistent@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('reset', () => {
    it('should set a new password for the requested user successfully', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue({
        id: '123',
        resetTokenExpiry: new Date(Date.now() + 3600 * 1000),
      });
      prismaService.user.update = jest.fn().mockResolvedValue({});
      mailsService.sendPasswordChangeConfirmationEmail = jest
        .fn()
        .mockResolvedValue(true);

      const result = await authService.reset({
        newPassword: 'NewPassword123!',
        token: 'validToken',
      });

      expect(result).toBe(true);
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(
        mailsService.sendPasswordChangeConfirmationEmail,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException if token is invalid', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        authService.reset({
          newPassword: 'NewPassword123!',
          token: 'invalidToken',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if token is expired', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue({
        id: '123',
        resetTokenExpiry: new Date(Date.now() - 3600 * 1000),
      });

      await expect(
        authService.reset({
          newPassword: 'NewPassword123!',
          token: 'expiredToken',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
