import { Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { UserModel } from 'src/common/models/user.model';
import { LoginUserInput } from 'src/modules/auth/dtos/request/login-user.input';
import { RegisterUserInput } from 'src/modules/auth/dtos/request/register-user.input';

const mockPassword = 'Test1234!';

export const mockUser: UserModel = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.internet.displayName(),
  role: Role.CLIENT,
  password: 'hashedPassword',
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

export const mockRegisterUserInput: RegisterUserInput = {
  email: mockUser.email,
  password: mockPassword,
  name: mockUser.name,
};

export const mockLoginUserInput: LoginUserInput = {
  email: mockUser.email,
  password: mockPassword,
};

export const mockLoginUserWrongInput: LoginUserInput = {
  email: faker.internet.email(),
  password: mockPassword,
};

export const mockToken = faker.string.uuid();
