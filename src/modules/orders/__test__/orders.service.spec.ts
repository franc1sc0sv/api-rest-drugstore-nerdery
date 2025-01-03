import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { OrdersService } from '../services/orders.service';
import { CartsService } from '../../carts/carts.service';
import { StripeService } from '../services/stripe.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let prismaService: PrismaService;
  let cartsService: CartsService;
  let stripeService: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CartsService,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should be defined', () => {
      expect(ordersService.createOrder).toBeDefined();
    });
  });
  describe('getOrders', () => {
    it('should be defined', () => {
      expect(ordersService.getOrders).toBeDefined();
    });
  });

  describe('getOrderById', () => {
    it('should be defined', () => {
      expect(ordersService.getOrderById).toBeDefined();
    });
  });

  describe('cancelOrder', () => {
    it('should be defined', () => {
      expect(ordersService.cancelOrder).toBeDefined();
    });
  });

  describe('generateNewPaymentIntent', () => {
    it('should be defined', () => {
      expect(ordersService.generateNewPaymentIntent).toBeDefined();
    });
  });

  describe('cancelPayment', () => {
    it('should be defined', () => {
      expect(ordersService.cancelPayment).toBeDefined();
    });
  });
});
