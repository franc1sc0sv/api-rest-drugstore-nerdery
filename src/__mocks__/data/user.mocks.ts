import { Role } from '@prisma/client';
import { UserModel } from 'src/common/models/user.model';
import { LoginUserInput } from 'src/modules/auth/dtos/request/login-user.input';
import { RegisterUserInput } from 'src/modules/auth/dtos/request/register-user.input';

export const mockUser: UserModel = {
  id: '5a7d2c31-67e4-4a0b-95db-4394ad8f62cd',
  email: 'test@example.com',
  name: 'Test1234!',
  role: Role.CLIENT,
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockRegisterUserInput: RegisterUserInput = {
  email: mockUser.email,
  password: 'Test1234!',
  name: mockUser.name,
};

export const mockLoginUserInput: LoginUserInput = {
  email: mockUser.email,
  password: 'Test1234!',
};

export const mockLoginUserWrongInput: LoginUserInput = {
  email: 'wrong@example.com',
  password: 'Test1234!',
};

export const mockToken = 'valid-token';
