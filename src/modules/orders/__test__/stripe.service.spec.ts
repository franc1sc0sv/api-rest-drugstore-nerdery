import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from '../services/stripe.service';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BadRequestException } from '@nestjs/common';
import { StripeEventType } from '../../../common/enums/stripeEvenType.enum';
import { OrderStatus } from '@prisma/client';

describe('StripeService', () => {
  let stripeService: StripeService;
  let prismaService: PrismaService;
  let stripeClient: jest.Mocked<Stripe>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockStripeClient = {
      webhooks: {
        constructEvent: jest.fn(),
      },
      paymentIntents: {
        create: jest.fn(),
        cancel: jest.fn(),
      },
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'STRIPE_ENDPOINT_SECRET') return 'test-secret';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: 'STRIPE_CLIENT', useValue: mockStripeClient },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    stripeClient = module.get('STRIPE_CLIENT') as jest.Mocked<Stripe>;
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(
      ConfigService,
    ) as jest.Mocked<ConfigService>;
  });

  describe('handleStripeWebhook', () => {
    it('should be defined', () => {
      expect(stripeService.handleStripeWebhook).toBeDefined();
    });

    it('should handle PAYMENT_INTENT_SUCCEEDED event', async () => {
      const event = {
        type: StripeEventType.PAYMENT_INTENT_SUCCEEDED,
        data: {
          object: {
            id: 'pi_12345',
            metadata: { orderId: 'order_123' },
            amount_received: 1000,
            status: 'succeeded',
            payment_method: 'pm_123',
          },
        },
      };

      stripeClient.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const updateOrderMock = (prismaService.order.update = jest.fn());
      const updatePaymentIntentMock = (prismaService.paymentIntent.update =
        jest.fn());

      const endpointSecret = configService.get('STRIPE_ENDPOINT_SECRET');
      expect(endpointSecret).toBe('test-secret');

      await stripeService.handleStripeWebhook(Buffer.from(''), 'signature');

      expect(updateOrderMock).toHaveBeenCalledWith({
        where: { id: 'order_123' },
        data: { orderStatus: OrderStatus.COMPLETED },
      });

      expect(updatePaymentIntentMock).toHaveBeenCalledWith({
        where: { stripePaymentId: 'pi_12345' },
        data: {
          stripeStatus: StripeEventType.PAYMENT_INTENT_SUCCEEDED,
          stripeAmount: 10,
          stripePaymentMethod: 'pm_123',
        },
      });
    });

    it('should handle PAYMENT_INTENT_PAYMENT_FAILED event', async () => {
      const event = {
        type: StripeEventType.PAYMENT_INTENT_PAYMENT_FAILED,
        data: {
          object: {
            id: 'pi_12345',
            metadata: { orderId: 'order_123' },
          },
        },
      };

      stripeClient.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const updateOrderMock = (prismaService.order.update = jest.fn());
      const updatePaymentIntentMock = (prismaService.paymentIntent.update =
        jest.fn());

      await stripeService.handleStripeWebhook(Buffer.from(''), 'signature');

      expect(updateOrderMock).toHaveBeenCalledWith({
        where: { id: 'order_123' },
        data: { orderStatus: OrderStatus.FAILED },
      });

      expect(updatePaymentIntentMock).toHaveBeenCalledWith({
        where: { stripePaymentId: 'pi_12345' },
        data: { stripeStatus: StripeEventType.PAYMENT_INTENT_PAYMENT_FAILED },
      });
    });

    it('should handle PAYMENT_INTENT_CANCELED event', async () => {
      const event = {
        type: StripeEventType.PAYMENT_INTENT_CANCELED,
        data: {
          object: {
            id: 'pi_12345',
          },
        },
      } as Stripe.Event;

      stripeClient.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const updatePaymentIntentMock = (prismaService.paymentIntent.update =
        jest.fn());

      await stripeService.handleStripeWebhook(Buffer.from(''), 'signature');

      expect(updatePaymentIntentMock).toHaveBeenCalledWith({
        where: { stripePaymentId: 'pi_12345' },
        data: { stripeStatus: StripeEventType.PAYMENT_INTENT_CANCELED },
      });
    });

    it('should throw BadRequestException for unhandled event type', async () => {
      const event = {
        type: 'UNHANDLED_EVENT',
        data: {
          object: {},
        },
      };

      stripeClient.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      try {
        await stripeService.handleStripeWebhook(Buffer.from(''), 'signature');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Unhandled event type: UNHANDLED_EVENT');
      }
    });

    it('should throw BadRequestException for invalid signature', async () => {
      stripeClient.webhooks.constructEvent = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('Webhook signature verification failed');
        });

      try {
        await stripeService.handleStripeWebhook(
          Buffer.from(''),
          'invalid-signature',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Webhook signature verification failed.');
      }
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const createPaymentIntentDto = { amount: 100, orderId: 'order_123' };

      stripeClient.paymentIntents.create = jest.fn().mockResolvedValue({
        id: 'pi_12345',
        amount_received: 100,
        currency: 'usd',
        status: 'succeeded',
        metadata: { orderId: 'order_123' },
      });

      const result = await stripeService.createPaymentIntent(
        createPaymentIntentDto,
      );

      expect(result).toEqual({
        id: 'pi_12345',
        amount_received: 100,
        currency: 'usd',
        status: 'succeeded',
        metadata: { orderId: 'order_123' },
      });
      expect(stripeClient.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'usd',
        metadata: { orderId: 'order_123' },
      });
    });
  });

  describe('cancelPaymentIntent', () => {
    it('should cancel a payment intent successfully', async () => {
      const paymentIntentIdDto = { id: 'pi_12345' };

      stripeClient.paymentIntents.cancel = jest.fn().mockResolvedValue({
        id: 'pi_12345',
        status: 'canceled',
      });

      const result =
        await stripeService.cancelPaymentIntent(paymentIntentIdDto);

      expect(result).toEqual({ id: 'pi_12345', status: 'canceled' });
      expect(stripeClient.paymentIntents.cancel).toHaveBeenCalledWith(
        'pi_12345',
      );
    });
  });
});
