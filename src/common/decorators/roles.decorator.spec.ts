import { Role } from '@prisma/client';
import { Roles, ROLES_KEY } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Roles Decorator', () => {
  it('should call SetMetadata with correct roles', () => {
    const roles = [Role.CLIENT, Role.MANAGER];

    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });

  it('should set the correct key for roles metadata', () => {
    const roles = [Role.MANAGER];

    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });
});
