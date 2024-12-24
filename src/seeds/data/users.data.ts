import { Role } from '@prisma/client';

export const usersdata = [
  {
    role: Role.ADMIN,
    count: 2,
    password: 'adminpassword',
  },
  {
    role: Role.MANAGER,
    count: 3,
    password: 'managerpassword',
  },
  {
    role: Role.CLIENT,
    count: 5,
    password: 'clientpassword',
  },
];
