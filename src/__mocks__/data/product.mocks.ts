import { faker } from '@faker-js/faker';
import { ProductModel } from 'src/common/models/product.model';

export const generateProduct = (): ProductModel => ({
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
