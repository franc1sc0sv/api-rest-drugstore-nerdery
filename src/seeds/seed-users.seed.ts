import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { usersdata } from './data/users.data';

const prisma = new PrismaClient();

export const seed = async () => {
  console.log('Seeding data...');

  for (const { role, count, password } of usersdata) {
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
