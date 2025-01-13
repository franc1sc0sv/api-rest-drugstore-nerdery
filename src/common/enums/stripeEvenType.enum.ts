export enum StripeEventType {
  PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED = 'payment_intent.canceled',
  PAYMENT_INTENT_CREATED = 'payment_intent.requires_payment_method',
}
