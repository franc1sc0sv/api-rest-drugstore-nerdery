import { CurrentUser } from './current-user.decorator'; // Ajusta la ruta según sea necesario
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { faker } from '@faker-js/faker';
import { UserModel } from '../models/user.model';
import { Role } from '@prisma/client';

jest.mock('nestjs-prisma', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      findFirst: jest.fn(),
    },
  })),
}));

const mockUser: UserModel = {
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

const mockGraphQLContext: Pick<GqlExecutionContext, 'getContext'> = {
  getContext: jest.fn(),
};

const mockExecutionContext: ExecutionContext = {
  getType: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  switchToHttp: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('CurrentUser Decorator', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaService = new PrismaService();
  });

  it('should return the user object from the request if "id" is present', async () => {
    const mockUser = { id: faker.string.uuid(), name: 'Test User' };

    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('graphql');
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as GqlExecutionContext);
    jest.spyOn(mockGraphQLContext, 'getContext').mockReturnValue({
      req: { user: mockUser },
    });

    const result = await CurrentUser(null, mockExecutionContext);

    expect(result).toMatchObject(mockUser);
  });

  it('should fetch the user from the database if "userId" is present', async () => {
    const userId = faker.string.uuid();
    const mockDatabaseUser = { id: userId, name: 'Database User' };

    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('graphql');
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as GqlExecutionContext);
    jest.spyOn(mockGraphQLContext, 'getContext').mockReturnValue({
      req: { user: { userId } },
    });

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

    const result = await CurrentUser(null, mockExecutionContext);

    expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toMatchObject(mockDatabaseUser);
  });

  it('should throw UnauthorizedException if "userId" is not present', async () => {
    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('graphql');
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as GqlExecutionContext);
    jest.spyOn(mockGraphQLContext, 'getContext').mockReturnValue({
      req: { user: {} },
    });

    await expect(CurrentUser(null, mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the user is not found in the database', async () => {
    const userId = faker.string.uuid();

    jest.spyOn(mockExecutionContext, 'getType').mockReturnValue('graphql');
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as GqlExecutionContext);
    jest.spyOn(mockGraphQLContext, 'getContext').mockReturnValue({
      req: { user: { userId } },
    });

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

    await expect(CurrentUser(null, mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
