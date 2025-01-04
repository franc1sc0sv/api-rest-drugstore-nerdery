import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { UserModel } from '../models/user.model';

export const userFactory = async (
  data: unknown,
  context: ExecutionContext,
  prismaService: PrismaService,
): Promise<UserModel> => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext().req;

  const fullUserId = req.user?.id;
  if (fullUserId) {
    return req.user as UserModel;
  }

  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedException('User not authenticated or token invalid');
  }

  const user = await prismaService.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  return user as UserModel;
};

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const prisma = new PrismaService();
    return userFactory(data, context, prisma);
  },
);
