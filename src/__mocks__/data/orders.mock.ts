import { faker } from '@faker-js/faker/.';
import { mockPaymentIntents } from './paymenIntent.mock';
import { calculateTotalPrice, generateCartItem } from './cart.mock';

const cartItemsOrder = Array.from(
  { length: Math.floor(Math.random() * 10) },
  generateCartItem,
);
const totalItems = calculateTotalPrice(cartItemsOrder);
const orderId = faker.string.uuid();

export const orderItems = cartItemsOrder.map((item) => ({
  id: faker.string.uuid(),
  productId: item.productId,
  product: item.product,
  quantity: item.quantity,
  orderId,
}));

export const generateOrder = () => ({
  id: faker.string.uuid(),
  total: totalItems,
  orderStatus: faker.helpers.arrayElement([
    'PENDING',
    'PAID',
    'SHIPPED',
    'CANCELLED',
  ]),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  userId: faker.string.uuid(),
  orderItems,
  payments: mockPaymentIntents.slice(0, faker.number.int({ min: 1, max: 2 })),
});

export const mockOrders = Array.from({ length: 15 }, generateOrder);
