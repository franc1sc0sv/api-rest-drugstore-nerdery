import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { StripeService } from '../services/stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

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
  });

  describe('createPaymentIntent', () => {
    it('should be defined', () => {
      expect(stripeService.createPaymentIntent).toBeDefined();
    });
  });

  describe('cancelPaymentIntent', () => {
    it('should be defined', () => {
      expect(stripeService.cancelPaymentIntent).toBeDefined();
    });
  });
});
