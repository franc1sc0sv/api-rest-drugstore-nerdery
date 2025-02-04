import { faker } from '@faker-js/faker/.';
import { generateProduct } from './product.mocks';
import { LikeModel } from 'src/common/models/like.model';
import { mockUser } from './user.mocks';

const generateLike = (): LikeModel => {
  const product = generateProduct();
  return {
    id: faker.string.uuid(),
    productId: product.id,
    userId: mockUser.id,
    createdAt: faker.date.recent(),
    product,
  };
};

export const mockLike = generateLike();

export const mockLikes = Array.from({ length: 5 }, generateLike);
