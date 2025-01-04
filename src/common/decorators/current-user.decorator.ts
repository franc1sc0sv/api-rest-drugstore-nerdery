import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const full_user_id = req.user?.id;
    if (full_user_id) {
      return { ...req.user };
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException(
        'User not authenticated or token invalid',
      );
    }

    const prisma = new PrismaService();

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  },
);
