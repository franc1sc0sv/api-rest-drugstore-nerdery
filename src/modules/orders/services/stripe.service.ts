import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentIntent } from '../dtos/request/create-payment-intent.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { StripeEventType } from '../../../common/enums/stripeEvenType.enum';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        `Webhook signature verification failed.`,
        err,
      );
    }

    switch (event.type) {
      case StripeEventType.PAYMENT_INTENT_SUCCEEDED:
        await this.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      case StripeEventType.PAYMENT_INTENT_PAYMENT_FAILED:
        await this.handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      case StripeEventType.PAYMENT_INTENT_CANCELED:
        await this.handlePaymentIntentCanceled(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      default:
        throw new BadRequestException(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const {
      id: paymentIntentId,
      metadata,
      amount_received,
      status,
    } = paymentIntent;

    if (status === 'succeeded') {
      await this.prismaService.order.update({
        where: { id: metadata.orderId },
        data: { orderStatus: 'COMPLETED' },
      });

      await this.prismaService.paymentIntent.update({
        where: { stripePaymentId: paymentIntentId },
        data: {
          stripeStatus: StripeEventType.PAYMENT_INTENT_SUCCEEDED,
          stripeAmount: amount_received / 100,
          stripePaymentMethod: paymentIntent.payment_method as string,
        },
      });
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const { id: paymentIntentId, metadata } = paymentIntent;

    await this.prismaService.order.update({
      where: { id: metadata.orderId },
      data: { orderStatus: OrderStatus.FAILED },
    });

    await this.prismaService.paymentIntent.update({
      where: { stripePaymentId: paymentIntentId },
      data: { stripeStatus: StripeEventType.PAYMENT_INTENT_PAYMENT_FAILED },
    });
  }

  private async handlePaymentIntentCanceled(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const { id: paymentIntentId } = paymentIntent;

    await this.prismaService.paymentIntent.update({
      where: { stripePaymentId: paymentIntentId },
      data: { stripeStatus: StripeEventType.PAYMENT_INTENT_CANCELED },
    });
  }

  async createPaymentIntent(
    createPaymentIntent: CreatePaymentIntent,
  ): Promise<Stripe.PaymentIntent> {
    const { amount, orderId } = createPaymentIntent;

    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { orderId },
    });
  }

  async cancelPaymentIntent(
    paymentIntentIdDto: IdDto,
  ): Promise<Stripe.PaymentIntent> {
    const { id: paymentIntentId } = paymentIntentIdDto;
    return await this.stripe.paymentIntents.cancel(paymentIntentId);
  }
}
