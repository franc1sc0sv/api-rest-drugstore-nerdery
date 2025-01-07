import { faker } from '@faker-js/faker';
import { CategoryModel } from 'src/common/models/category.model';

const generateCategory = (): CategoryModel => ({
  id: faker.string.uuid(),
  name: faker.commerce.department(),
  description: faker.commerce.productDescription(),
  parentId: null,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  parent: null,
  subCategories: [],
});

export const mockCategory = generateCategory();

export const mockCategories = Array.from({ length: 5 }, generateCategory);
