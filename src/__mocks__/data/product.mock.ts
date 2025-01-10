import { faker } from '@faker-js/faker';

export const mockPage = 1;
export const mockPageSize = faker.number.int({ min: 1, max: 20 });

export const generateProduct = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 100, max: 200 })),
  stock: faker.number.int({ min: 1, max: 50 }),
  isDisabled: false,
  lowStockNotified: false,
  categoryId: faker.string.uuid(),
  category: null,
  images: [],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

export const mockProducts = Array.from({ length: 50 }, generateProduct);
