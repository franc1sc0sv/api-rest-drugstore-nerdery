import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDto } from 'src/common/dtos/cart.dto';
import { AddItemToCartInput } from './dtos/request/add-item-to-cart.input';
import { PrismaService } from 'nestjs-prisma';
import { IdDto } from 'src/common/dtos/id.dto';
import { UserDto } from 'src/common/dtos/user.dto';
import { TotalCart } from './dtos/response/total-cart.dto';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findCartByUserId(user: UserDto): Promise<CartDto> {
    const { id: userId } = user;
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for the given user.');
    }

    return cart;
  }

  async addItemToCart(
    addItemToCartInput: AddItemToCartInput,
    user: UserDto,
  ): Promise<CartDto> {
    const { productId, quantity } = addItemToCartInput;
    const { id: userId } = user;
    let cart = await this.prismaService.cart.findFirst({ where: { userId } });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: { userId },
      });
    }

    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      await this.prismaService.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.findCartByUserId(user);
  }

  async removeCartItem(cartItemIdDto: IdDto, user: UserDto): Promise<boolean> {
    const { id: cartItemId } = cartItemIdDto;

    const cart = await this.findCartByUserId(user);

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    await this.prismaService.cartItem.delete({ where: { id: cartItemId } });

    return true;
  }

  async calculateTotal(user: UserDto): Promise<TotalCart> {
    const cart = await this.findCartByUserId(user);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      return {
        id: cart.id,
        total: 0,
      };
    }

    const total = cart.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    return {
      id: cart.id,
      total,
    };
  }
}
