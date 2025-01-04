import { userFactory } from './current-user.decorator';
import { PrismaService } from 'nestjs-prisma';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { GqlExecutionContext } from '@nestjs/graphql';

const fixedUserId = 'user-12345';
const mockUser: UserModel = {
  id: fixedUserId,
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

describe('CurrentUserDecorator', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      user: {
        findFirst: jest.fn(),
      },
    } as any;
  });

  it('should return the user directly from the request if user is present', async () => {
    const mockGraphQLContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user: mockUser },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as any);

    const mockExecutionContext: ExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
    };

    const user = await userFactory(null, mockExecutionContext, prismaService);

    expect(user).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if user and userId do not exist', async () => {
    const mockGraphQLContext = {
      getContext: jest.fn().mockReturnValue({
        req: {},
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as any);

    const mockExecutionContext: ExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
    };

    await expect(
      userFactory(null, mockExecutionContext, prismaService),
    ).rejects.toThrow(
      new UnauthorizedException('User not authenticated or token invalid'),
    );
  });

  it('should throw UnauthorizedException if user is not found in Prisma', async () => {
    const mockGraphQLContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user: { userId: fixedUserId } },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as any);

    const mockExecutionContext: ExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
    };

    (prismaService.user.findFirst as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      userFactory(null, mockExecutionContext, prismaService),
    ).rejects.toThrow(new UnauthorizedException('User not found'));

    expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      where: { id: fixedUserId },
    });
  });

  it('should fetch the user from Prisma if only userId is present', async () => {
    const mockGraphQLContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user: { userId: fixedUserId } },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext as any);

    const mockExecutionContext: ExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
    };

    (prismaService.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const user = await userFactory(null, mockExecutionContext, prismaService);

    expect(user).toEqual(mockUser);
    expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      where: { id: fixedUserId },
    });
  });
});
