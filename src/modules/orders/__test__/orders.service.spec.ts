import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { OrdersService } from '../services/orders.service';
import { CartsService } from '../../carts/carts.service';
import { StripeService } from '../services/stripe.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import {
  cartOrder,
  mockNewPaymentIntent,
  mockOrderCompleted,
  mockOrderPending,
  mockOrders,
  mockPaymentIntent,
  mockPaymentIntentCanceled,
  mockPaymentIntentSucceded,
} from '../../../__mocks__/data/orders.mock';
import { mockUser } from '../../../__mocks__/data/user.mock';

describe('OrdersService', () => {
  let ordersService: DeepMocked<OrdersService>;
  let prismaService: typeof mockPrismaService;
  let cartsService: DeepMocked<CartsService>;
  let stripeService: DeepMocked<StripeService>;

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
          useValue: createMock<CartsService>(),
        },
        {
          provide: StripeService,
          useValue: createMock<StripeService>(),
        },
      ],
    }).compile();

    ordersService = module.get(OrdersService);
    prismaService = module.get(PrismaService);
    cartsService = module.get(CartsService);
    stripeService = module.get(StripeService);
  });

  describe('createOrder', () => {
    it('should create an order and call StripeService to create a payment intent', async () => {
      cartsService.findCartByUserId.mockResolvedValue(cartOrder);
      prismaService.order.create.mockResolvedValue(mockOrderPending);
      stripeService.createPaymentIntent.mockResolvedValue({
        client_secret: mockPaymentIntent.stripeClientSecret,
      } as Stripe.PaymentIntent);
      prismaService.paymentIntent.create(mockPaymentIntent);

      const result = await ordersService.createOrder(mockUser);

      expect(result.client_secret).toBe(mockPaymentIntent.stripeClientSecret);

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockOrderPending.total,
        orderId: mockOrderPending.id,
      });
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          total: mockOrderPending.total,
          orderItems: expect.anything(),
        }),
      });
    });

    it('should throw NotFoundException if cart is empty', async () => {
      const emptyCart = { ...cartOrder, cartItems: [] };
      cartsService.findCartByUserId.mockResolvedValue(emptyCart);

      await expect(ordersService.createOrder(mockUser)).rejects.toThrow(
        new NotFoundException('Cart is empty.'),
      );
    });
  });

  describe('getOrders', () => {
    it('should return a list of orders', async () => {
      prismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await ordersService.getOrders(mockUser);

      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      prismaService.order.findFirst.mockResolvedValue(mockOrderCompleted);

      const result = await ordersService.getOrderById({
        id: mockOrderCompleted.id,
      });

      expect(result).toEqual(mockOrderCompleted);
    });

    it('should throw NotFoundException if order is not found', async () => {
      prismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        ordersService.getOrderById({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found.'));
    });
  });

  describe('cancelOrder', () => {
    it('should cancel all payment intents and update the order status to CANCELED', async () => {
      prismaService.order.findFirst.mockResolvedValue(mockOrderPending);

      stripeService.cancelPaymentIntent.mockResolvedValue({
        id: mockPaymentIntentCanceled.stripePaymentId,
        client_secret: mockPaymentIntentCanceled.stripeClientSecret,
        status: mockPaymentIntentCanceled.stripeStatus,
      } as Stripe.PaymentIntent);

      prismaService.order.update.mockResolvedValue({
        ...mockOrderPending,
        orderStatus: OrderStatus.CANCELED,
      });

      const result = await ordersService.cancelOrder({
        id: mockOrderPending.id,
      });

      expect(result.orderStatus).toBe(OrderStatus.CANCELED);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        ordersService.cancelOrder({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found.'));
    });

    it('should throw an error if the order is already completed', async () => {
      prismaService.order.findFirst.mockResolvedValue(mockOrderCompleted);

      await expect(
        ordersService.cancelOrder({ id: mockOrderCompleted.id }),
      ).rejects.toThrow(new Error('Cannot cancel a completed order.'));
    });

    it('should not throw an error if there are no payments to cancel', async () => {
      prismaService.order.findFirst.mockResolvedValue({
        ...mockOrderPending,
        payments: [],
      });

      prismaService.order.update.mockResolvedValue({
        ...mockOrderPending,
        orderStatus: OrderStatus.CANCELED,
        payments: [],
      });

      const result = await ordersService.cancelOrder({
        id: mockOrderPending.id,
      });

      expect(result.orderStatus).toBe(OrderStatus.CANCELED);
      expect(stripeService.cancelPaymentIntent).not.toHaveBeenCalled();
    });
  });

  describe('generateNewPaymentIntent', () => {
    it('should generate a new payment intent for an order', async () => {
      prismaService.order.findFirst.mockResolvedValue(mockOrderPending);
      prismaService.paymentIntent.create.mockResolvedValue(
        mockNewPaymentIntent,
      );

      const result = await ordersService.generateNewPaymentIntent({
        id: mockOrderPending.id,
      });

      expect(result.stripePaymentId).toBe(mockNewPaymentIntent.stripePaymentId);

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockOrderPending.total,
        orderId: mockOrderPending.id,
      });
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        ordersService.generateNewPaymentIntent({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found'));
    });
  });

  describe('cancelPayment', () => {
    it('should cancel a payment intent', async () => {
      prismaService.paymentIntent.findUnique.mockResolvedValue(
        mockPaymentIntent,
      );

      stripeService.cancelPaymentIntent.mockResolvedValue({
        client_secret: mockPaymentIntent.stripeClientSecret,
      } as Stripe.PaymentIntent);

      const result = await ordersService.cancelPayment({
        id: mockPaymentIntent.id,
      });

      expect(result).toBe(true);
      expect(stripeService.cancelPaymentIntent).toHaveBeenCalledWith({
        id: mockPaymentIntent.stripePaymentId,
      });
    });

    it('should throw BadRequestException if the payment is already completed', async () => {
      prismaService.paymentIntent.findUnique.mockResolvedValue(
        mockPaymentIntentSucceded,
      );

      await expect(
        ordersService.cancelPayment({
          id: mockPaymentIntentSucceded.id,
        }),
      ).rejects.toThrow(
        new BadRequestException('Cannot cancel a completed payment.'),
      );
    });

    it('should throw NotFoundException if payment intent does not exist', async () => {
      prismaService.paymentIntent.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.cancelPayment({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('PaymentIntent not found.'));
    });
  });
});
