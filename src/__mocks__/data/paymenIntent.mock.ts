import { faker } from '@faker-js/faker';
import { StripeEventType } from '../../common/enums/stripeEvenType.enum';
import { PaymentIntentModel } from '../../common/models/payment-intent.model';

export const generatePaymentIntent = (
  orderId: string,
  stripeStatus?: StripeEventType,
): PaymentIntentModel => ({
  id: faker.string.uuid(),
  orderId,
  stripePaymentId: faker.string.uuid(),
  stripeClientSecret: faker.string.uuid(),
  stripeStatus: stripeStatus || faker.helpers.enumValue(StripeEventType),
  stripeAmount: faker.number.int({ min: 100, max: 10000 }),
  stripeCurrency: faker.finance.currencyCode(),
  stripePaymentMethod: faker.helpers.arrayElement([faker.string.uuid(), null]),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});
