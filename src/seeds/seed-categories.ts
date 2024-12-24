import { PrismaClient } from '@prisma/client';
import { categories } from './data/categories.data';

const prisma = new PrismaClient();

export const seedCategories = async () => {
  console.log('Seeding categories...');

  for (const category of categories) {
    const { subcategories, ...categoryData } = category;

    const existingCategory = await categoryExists(categoryData.name);
    if (existingCategory) {
      console.log(`Category "${categoryData.name}" already exists. Skipping.`);
      continue;
    }

    const createdCategory = await prisma.category.create({
      data: categoryData,
    });

    for (const subcategory of subcategories) {
      await prisma.category.create({
        data: {
          ...subcategory,
          parentId: createdCategory.id,
        },
      });
    }

    console.log(`Created category: ${category.name} with subcategories.`);
  }

  console.log('Seeding categories completed.');
  await prisma.$disconnect();
};

const categoryExists = async (name: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: { name },
  });
  return existingCategory !== null;
};
