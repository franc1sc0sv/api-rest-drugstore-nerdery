import { Role } from '@prisma/client';

export const usersdata = [
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
