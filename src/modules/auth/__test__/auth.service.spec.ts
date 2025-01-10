import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';
import { PrismaService } from 'nestjs-prisma';
import { MailsService } from '../../mails/mails.service';

import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { mockJwtService } from '../../../__mocks__/dependecies/jwt.service.mocks';
import { mockMailsService } from '../../../__mocks__/dependecies/mails.service.mocks';

import {
  comparePassword,
  hashPassword,
} from '../../../common/utils/bcrypt.util';

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  mockLoginUserInput,
  mockToken,
  mockUser,
  mockRegisterUserInput,
  mockLoginUserWrongInput,
} from '../../../__mocks__/data/user.mock';

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
    it('should register a new user successfully', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue(mockUser);

      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register(mockRegisterUserInput);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockRegisterUserInput.email },
      });

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockRegisterUserInput.email,
          password: 'hashedPassword',
          name: mockRegisterUserInput.name,
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          email: mockRegisterUserInput.email,
          name: mockRegisterUserInput.name,
        }),
      );
    });

    it('should throw ConflictException if email is already registered', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      await expect(authService.register(mockRegisterUserInput)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      prismaService.user.findFirst = jest
        .fn()
        .mockRejectedValue(new Error('Unexpected Error'));

      await expect(authService.register(mockRegisterUserInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('should return a valid token', async () => {
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
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(mockLoginUserInput);

      expect(result).toEqual(expect.objectContaining(mockUser));
    });

    it('should throw UnauthorizedException if email is incorrect', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        authService.validateUser(mockLoginUserWrongInput),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser(mockLoginUserWrongInput),
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
