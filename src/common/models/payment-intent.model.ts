import { ObjectType, Field } from '@nestjs/graphql';
import { PaymentIntent } from '@prisma/client';

@ObjectType()
export class PaymentIntentModel implements Partial<PaymentIntent> {
  @Field()
  id: string;

  @Field()
  orderId: string;

  @Field()
  stripePaymentId: string;

  @Field()
  stripeClientSecret: string;

  @Field()
  stripeStatus: string;

  @Field()
  stripeAmount: number;

  @Field()
  stripeCurrency: string;

  @Field({ nullable: true })
  stripePaymentMethod?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
