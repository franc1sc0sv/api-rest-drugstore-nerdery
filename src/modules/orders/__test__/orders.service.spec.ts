import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { OrdersService } from '../services/orders.service';
import { CartsService } from '../../carts/carts.service';
import { StripeService } from '../services/stripe.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { UserModel } from '../../../common/models/user.model';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';
import { OrderModel } from 'src/common/models/order.model';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let prismaService: PrismaService;
  let cartsService: CartsService;
  let stripeService: StripeService;

  const mockUser: UserModel = {
    id: 'test-user-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: 'CLIENT',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCart = {
    id: 'cart-id',
    userId: mockUser.id,
    cartItems: [
      { productId: 'product-id', quantity: 2, product: { price: 50 } },
    ],
  };

  const mockOrder = {
    id: 'order-id',
    total: 100,
    orderStatus: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: mockUser.id,
    orderItems: [{ productId: 'product-id', quantity: 2 }],
    payments: [],
  };

  const mockPaymentIntent = {
    id: 'payment-intent-id',
    client_secret: 'client-secret',
    status: 'pending',
    currency: 'usd',
    payment_method: 'card',
  };

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
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue(mockCart),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn().mockResolvedValue(mockPaymentIntent),
            cancelPaymentIntent: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cartsService = module.get<CartsService>(CartsService);
    stripeService = module.get<StripeService>(StripeService);
  });

  describe('createOrder', () => {
    it('should create an order and call StripeService to create a payment intent', async () => {
      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockOrder);
      jest.spyOn(prismaService.paymentIntent, 'create').mockResolvedValue({
        id: 'payment-intent-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: mockOrder.id,
        stripePaymentId: mockPaymentIntent.id,
        stripeClientSecret: mockPaymentIntent.client_secret,
        stripeStatus: mockPaymentIntent.status,
        stripeAmount: mockOrder.total,
        stripeCurrency: mockPaymentIntent.currency,
        stripePaymentMethod: mockPaymentIntent.payment_method,
      });

      const result = await ordersService.createOrder(mockUser);

      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty(
        'client_secret',
        mockPaymentIntent.client_secret,
      );
      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockOrder.total,
        orderId: mockOrder.id,
      });
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          total: mockOrder.total,
          orderItems: expect.anything(),
        }),
      });
    });

    it('should throw NotFoundException if cart is empty', async () => {
      const emptyCart = { ...mockCart, cartItems: [] };
      jest.spyOn(cartsService, 'findCartByUserId').mockResolvedValue(emptyCart);

      await expect(ordersService.createOrder(mockUser)).rejects.toThrow(
        new NotFoundException('Cart is empty.'),
      );
    });
  });

  describe('getOrders', () => {
    it('should return a list of orders', async () => {
      const orders = [mockOrder];
      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(orders);

      const result = await ordersService.getOrders(mockUser);

      expect(result).toEqual(orders);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(mockOrder);

      const result = await ordersService.getOrderById({ id: mockOrder.id });

      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(null);

      await expect(
        ordersService.getOrderById({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found.'));
    });
  });

  describe('cancelOrder', () => {
    const mockPayments = [
      {
        id: 'payment-1',
        stripePaymentId: 'stripe-payment-id-1',
        stripeStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: 'order-id',
        stripeClientSecret: 'secret_1',
        stripeAmount: 1000,
        stripeCurrency: 'usd',
        stripePaymentMethod: 'card',
      },
      {
        id: 'payment-2',
        stripePaymentId: 'stripe-payment-id-2',
        stripeStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: 'order-id',
        stripeClientSecret: 'secret_2',
        stripeAmount: 2000,
        stripeCurrency: 'usd',
        stripePaymentMethod: 'card',
      },
    ];

    it('should cancel all payment intents and update the order status to CANCELED', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue({
        ...mockOrder,
        payments: mockPayments,
      } as OrderModel);

      jest.spyOn(stripeService, 'cancelPaymentIntent').mockResolvedValue({
        id: 'stripe-payment-id-1',
        client_secret: 'secret_1',
        status: 'canceled',
      } as Stripe.PaymentIntent);

      jest.spyOn(prismaService.order, 'update').mockResolvedValue({
        ...mockOrder,
        orderStatus: OrderStatus.CANCELED,
        payments: mockPayments,
      } as OrderModel);

      const result = await ordersService.cancelOrder({ id: mockOrder.id });

      // Verificar que la orden fue cancelada correctamente
      expect(result.orderStatus).toBe(OrderStatus.CANCELED);

      // Verificar que se cancelaron todos los intents de pago
      expect(stripeService.cancelPaymentIntent).toHaveBeenCalledTimes(
        mockPayments.length,
      );
      mockPayments.forEach((payment) => {
        expect(stripeService.cancelPaymentIntent).toHaveBeenCalledWith({
          id: payment.stripePaymentId,
        });
      });

      // Verificar que se actualizó la orden a CANCELED
      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: mockOrder.id },
        data: {
          orderStatus: OrderStatus.CANCELED,
        },
        include: expect.anything(),
      });
    });

    it('should throw NotFoundException if order does not exist', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(null);

      await expect(
        ordersService.cancelOrder({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found.'));
    });

    it('should throw an error if the order is already completed', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue({
        ...mockOrder,
        orderStatus: OrderStatus.COMPLETED,
        payments: mockPayments,
      } as OrderModel);

      await expect(
        ordersService.cancelOrder({ id: mockOrder.id }),
      ).rejects.toThrow(new Error('Cannot cancel a completed order.'));
    });

    it('should not throw an error if there are no payments to cancel', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue({
        ...mockOrder,
        payments: [],
      } as OrderModel);

      jest.spyOn(prismaService.order, 'update').mockResolvedValue({
        ...mockOrder,
        orderStatus: OrderStatus.CANCELED,
        payments: [],
      } as OrderModel);

      const result = await ordersService.cancelOrder({ id: mockOrder.id });

      expect(result.orderStatus).toBe(OrderStatus.CANCELED);
      expect(stripeService.cancelPaymentIntent).not.toHaveBeenCalled();
    });
  });

  describe('generateNewPaymentIntent', () => {
    it('should generate a new payment intent for an order', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(mockOrder);
      jest.spyOn(prismaService.paymentIntent, 'create').mockResolvedValue({
        id: 'payment-intent-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: mockOrder.id,
        stripePaymentId: mockPaymentIntent.id,
        stripeClientSecret: mockPaymentIntent.client_secret,
        stripeStatus: mockPaymentIntent.status,
        stripeAmount: mockOrder.total,
        stripeCurrency: mockPaymentIntent.currency,
        stripePaymentMethod: mockPaymentIntent.payment_method,
      });

      const result = await ordersService.generateNewPaymentIntent({
        id: mockOrder.id,
      });

      expect(result).toHaveProperty('stripePaymentId', mockPaymentIntent.id);
      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: mockOrder.total,
        orderId: mockOrder.id,
      });
    });

    it('should throw NotFoundException if order does not exist', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(null);

      await expect(
        ordersService.generateNewPaymentIntent({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('Order not found'));
    });
  });

  describe('cancelPayment', () => {
    it('should cancel a payment intent', async () => {
      jest.spyOn(prismaService.paymentIntent, 'findUnique').mockResolvedValue({
        id: 'some-unique-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        stripePaymentId: 'payment-id',
        stripeStatus: 'pending',
        orderId: 'orderId-123',
        stripeClientSecret: 'secret_12345',
        stripeAmount: 1000,
        stripeCurrency: 'usd',
        stripePaymentMethod: 'pm_12345',
      });
      jest.spyOn(stripeService, 'cancelPaymentIntent').mockResolvedValue({
        client_secret: 'secret_12345',
      } as Stripe.PaymentIntent);
      const result = await ordersService.cancelPayment({
        id: 'payment-intent-id',
      });

      expect(result).toBe(true);
      expect(stripeService.cancelPaymentIntent).toHaveBeenCalledWith({
        id: 'payment-id',
      });
    });

    it('should throw BadRequestException if the payment is already completed', async () => {
      jest.spyOn(prismaService.paymentIntent, 'findUnique').mockResolvedValue({
        stripePaymentId: 'payment-id',
        stripeStatus: 'succeeded',
        id: 'some-unique-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: 'orderId-123',
        stripeClientSecret: 'secret_12345',
        stripeAmount: 1000,
        stripeCurrency: 'usd',
        stripePaymentMethod: 'pm_12345',
      });

      await expect(
        ordersService.cancelPayment({ id: 'payment-intent-id' }),
      ).rejects.toThrow(
        new BadRequestException('Cannot cancel a completed payment.'),
      );
    });

    it('should throw NotFoundException if payment intent does not exist', async () => {
      jest
        .spyOn(prismaService.paymentIntent, 'findUnique')
        .mockResolvedValue(null);

      await expect(
        ordersService.cancelPayment({ id: 'non-existing-id' }),
      ).rejects.toThrow(new NotFoundException('PaymentIntent not found.'));
    });
  });
});
