import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  };

  beforeEach(() => {
    reflector = mockReflector as unknown as Reflector;
    rolesGuard = new RolesGuard(reflector);
  });

  it('should return true if no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);

    const result = rolesGuard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      mockExecutionContext.getHandler(),
    ]);
  });

  it('should return true if user has the required roles', () => {
    const requiredRoles: Role[] = [Role.MANAGER];
    const user = { role: Role.MANAGER };

    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const gqlExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext as unknown as GqlExecutionContext);

    const result = rolesGuard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      mockExecutionContext.getHandler(),
    ]);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(
      mockExecutionContext,
    );
  });

  it('should return false if user does not have the required roles', () => {
    const requiredRoles: Role[] = [Role.MANAGER];
    const user = { role: Role.CLIENT };

    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const gqlExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext as unknown as GqlExecutionContext);

    const result = rolesGuard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );

    expect(result).toBe(false);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      mockExecutionContext.getHandler(),
    ]);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(
      mockExecutionContext,
    );
  });

  it('should return false if no user is present in the context', () => {
    const requiredRoles: Role[] = [Role.MANAGER];

    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const gqlExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: { user: null },
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext as unknown as GqlExecutionContext);

    const result = rolesGuard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );

    expect(result).toBe(false);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      mockExecutionContext.getHandler(),
    ]);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(
      mockExecutionContext,
    );
  });
});
