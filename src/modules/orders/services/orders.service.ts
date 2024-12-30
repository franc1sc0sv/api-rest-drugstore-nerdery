import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CartsService } from 'src/modules/carts/carts.service';
import { StripeService } from './stripe.service';
import { Order } from 'src/common/dtos/order.dto';
import { OrderStatus } from '@prisma/client';
import { UserDto } from 'src/common/dtos/user.dto';
import { CreatePaymentIntent } from '../dtos/request/create-payment-intent.dto';
import { createOrderResponseDto } from '../dtos/response/create-order-response.dto';
import { IdDto } from 'src/common/dtos/id.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartsService: CartsService,
    private readonly stripeService: StripeService,
  ) {}

  async createOrder(user: UserDto): Promise<createOrderResponseDto> {
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

  async getOrders(user: UserDto): Promise<Order[]> {
    const { id: userId } = user;
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          select: {
            id: true,
            product: true,
            quantity: true,
            orderId: true,
            productId: true,
          },
        },
        payments: true,
      },
    });

    return orders;
  }

  async getOrderById(orderIdDto: IdDto): Promise<Order> {
    const { id: orderId } = orderIdDto;

    const order = await this.prismaService.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: {
          select: {
            id: true,
            product: true,
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

  async cancelOrder(orderIdDto: IdDto): Promise<Order> {
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

    payments.forEach(async (payment) => {
      await this.stripeService.cancelPaymentIntent({
        id: payment.stripePaymentId,
      });
    });

    const canceledOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        orderStatus: OrderStatus.CANCELED,
      },
      include: {
        orderItems: {
          select: {
            id: true,
            product: true,
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
}
