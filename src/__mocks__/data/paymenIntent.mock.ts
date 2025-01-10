import { faker } from '@faker-js/faker';

export const generatePaymentIntent = () => ({
  id: faker.string.uuid(),
  orderId: faker.string.uuid(),
  stripePaymentId: faker.string.uuid(),
  stripeClientSecret: faker.string.uuid(),
  stripeStatus: faker.helpers.arrayElement(['succeeded', 'pending', 'failed']),
  stripeAmount: faker.number.int({ min: 100, max: 10000 }),
  stripeCurrency: faker.finance.currencyCode(),
  stripePaymentMethod: faker.helpers.arrayElement([faker.string.uuid(), null]),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

export const mockPaymentIntents = Array.from(
  { length: 10 },
  generatePaymentIntent,
);

export const mockPaymentIntent = generatePaymentIntent();
