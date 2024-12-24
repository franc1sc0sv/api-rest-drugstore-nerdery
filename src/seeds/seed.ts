import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from 'src/common/utils/bcrypt.util';

const prisma = new PrismaClient();

export const seed = async () => {
  console.log('Seeding data...');

  const usersToCreate = [
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

  for (const { role, count, password } of usersToCreate) {
    const existingUsers = await prisma.user.findMany({
      where: { role },
    });

    const remainingUsers = count - existingUsers.length;

    if (remainingUsers > 0) {
      const users = Array.from({ length: remainingUsers }, () => {
        return {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password,
          role,
        };
      });

      for (const user of users) {
        user.password = await hashPassword(user.password);
      }

      await prisma.user.createMany({
        data: users,
      });

      console.log(`Created ${remainingUsers} ${role}s.`);
    }
  }

  console.log('Seeding completed.');
  await prisma.$disconnect();
};
