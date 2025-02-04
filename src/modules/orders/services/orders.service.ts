import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import { CartsService } from '../../carts/carts.service';
import { StripeService } from './stripe.service';

import { OrderModel } from '../../../common/models/order.model';

import { OrderStatus } from '@prisma/client';
import { UserModel } from '../../../common/models/user.model';
import { IdDto } from '../../../common/dtos/id.dto';
import { CreatePaymentIntent } from '../dtos/request/create-payment-intent.dto';
import { createOrderResponseDto } from '../dtos/response/create-order-response.dto';
import { PaymentIntentModel } from '../../../common/models/payment-intent.model';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: CartsService,
    private readonly stripeService: StripeService,
  ) {}

  async createOrder(user: UserModel): Promise<createOrderResponseDto> {
    const cart = await this.cartsService.findCartByUserId(user);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty.');
    }

    const totalAmount = cart.cartItems.reduce(
      (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
      0,
    );

    const order = await this.prismaService.order.create({
      data: {
        userId: user.id,
        total: totalAmount,
        orderStatus: OrderStatus.PENDING,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    const paymentIntentData: CreatePaymentIntent = {
      amount: totalAmount,
      orderId: order.id,
    };

    const paymentIntent =
      await this.stripeService.createPaymentIntent(paymentIntentData);

    await this.prismaService.paymentIntent.create({
      data: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        stripeStatus: paymentIntent.status,
        stripeAmount: totalAmount,
        stripeCurrency: paymentIntent.currency,
        stripePaymentMethod: paymentIntent.payment_method as string,
      },
    });

    await this.prismaService.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      order,
      client_secret: paymentIntent.client_secret,
    };
  }

  async getOrders(user: UserModel): Promise<OrderModel[]> {
    const { id: userId } = user;
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { orderStatus: 'asc' },
      include: {
        orderItems: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                description: true,
                images: true,
                name: true,
                price: true,
                categoryId: true,
              },
            },
            quantity: true,
            orderId: true,
            productId: true,
          },
        },
        payments: { orderBy: { createdAt: 'asc' } },
      },
    });

    return orders;
  }

  async getOrderById(orderIdDto: IdDto): Promise<OrderModel> {
    const { id: orderId } = orderIdDto;

    const order = await this.prismaService.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                description: true,
                images: true,
                name: true,
                price: true,
                categoryId: true,
              },
            },
            quantity: true,
            orderId: true,
            productId: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async cancelOrder(orderIdDto: IdDto): Promise<OrderModel> {
    const { id: orderId } = orderIdDto;

    const order = await this.prismaService.order.findFirst({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.orderStatus === OrderStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed order.');
    }

    const { payments } = order;

    // Asegurarse de cancelar todos los intents de pago
    await Promise.all(
      payments.map((payment) =>
        this.stripeService.cancelPaymentIntent({ id: payment.stripePaymentId }),
      ),
    );

    const canceledOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        orderStatus: OrderStatus.CANCELED,
      },
      include: {
        orderItems: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                description: true,
                images: true,
                name: true,
                price: true,
                categoryId: true,
              },
            },
            quantity: true,
            orderId: true,
            productId: true,
          },
        },
        payments: true,
      },
    });

    return canceledOrder;
  }

  async generateNewPaymentIntent(
    orderIdDto: IdDto,
  ): Promise<PaymentIntentModel> {
    const { id: orderId } = orderIdDto;
    const order = await this.prismaService.order.findFirst({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const paymentIntentData: CreatePaymentIntent = {
      amount: order.total,
      orderId: order.id,
    };

    const paymentIntent =
      await this.stripeService.createPaymentIntent(paymentIntentData);

    return await this.prismaService.paymentIntent.create({
      data: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        stripeStatus: paymentIntent.status,
        stripeAmount: order.total,
        stripeCurrency: paymentIntent.currency,
        stripePaymentMethod: paymentIntent.payment_method as string,
      },
    });
  }

  async cancelPayment(paymentIntentIdDto: IdDto): Promise<boolean> {
    const { id: paymentIntentId } = paymentIntentIdDto;
    const paymentIntent = await this.prismaService.paymentIntent.findUnique({
      where: { id: paymentIntentId },
    });

    if (!paymentIntent) {
      throw new NotFoundException('PaymentIntent not found.');
    }

    if (paymentIntent.stripeStatus === 'succeeded') {
      throw new BadRequestException('Cannot cancel a completed payment.');
    }

    await this.stripeService.cancelPaymentIntent({
      id: paymentIntent.stripePaymentId,
    });

    return true;
  }
}
