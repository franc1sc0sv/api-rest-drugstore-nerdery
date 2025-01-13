import { faker } from '@faker-js/faker/.';
import { mockCartCalculateTotal } from './cart.mock';
import { OrderStatus } from '@prisma/client';
import { generatePaymentIntent } from './paymenIntent.mock';
import { StripeEventType } from '../../common/enums/stripeEvenType.enum';
import { PaymentIntentModel } from '../../common/models/payment-intent.model';
import { OrderModel } from '../../common/models/order.model';

const orderId = faker.string.uuid();

export const orderItems = mockCartCalculateTotal.cartItems.map((item) => ({
  id: faker.string.uuid(),
  productId: item.productId,
  product: item.product,
  quantity: item.quantity,
  orderId,
}));

export const mockPaymentIntent = generatePaymentIntent(
  orderId,
  StripeEventType.PAYMENT_INTENT_CREATED,
);

export const mockPaymentIntentCanceled: PaymentIntentModel = {
  ...mockPaymentIntent,
  stripeStatus: StripeEventType.PAYMENT_INTENT_CANCELED,
};

export const mockNewPaymentIntent: PaymentIntentModel = generatePaymentIntent(
  orderId,
  StripeEventType.PAYMENT_INTENT_CREATED,
);

export const mockPaymentIntentSucceded: PaymentIntentModel = {
  ...mockPaymentIntent,
  stripeStatus: StripeEventType.PAYMENT_INTENT_SUCCEEDED,
};

export const generateOrder = (
  status?: OrderStatus,
  paymentIntents?: PaymentIntentModel[],
): OrderModel => ({
  id: faker.string.uuid(),
  total: mockCartCalculateTotal.totalPrice,
  orderStatus: status || faker.helpers.enumValue(OrderStatus),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  userId: faker.string.uuid(),
  orderItems,
  payments: paymentIntents || [mockPaymentIntent],
});

export const cartOrder = { ...mockCartCalculateTotal };

export const mockOrders = Array.from({ length: 15 }, () => {
  return generateOrder();
});

export const mockOrderCompleted = generateOrder(OrderStatus.COMPLETED);
export const mockOrderCanceled = generateOrder(OrderStatus.CANCELED);
export const mockOrderFailed = generateOrder(OrderStatus.FAILED);
export const mockOrderPending = generateOrder(OrderStatus.PENDING);
