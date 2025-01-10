import { Injectable, NotFoundException } from '@nestjs/common';
import { CartModel } from 'src/common/models/cart.model';
import { AddItemToCartInput } from './dtos/request/add-item-to-cart.input';
import { PrismaService } from 'nestjs-prisma';
import { IdDto } from 'src/common/dtos/id.dto';
import { UserModel } from 'src/common/models/user.model';
import { TotalCartResponse } from './dtos/response/total-cart.response';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findCartByUserId(user: UserModel): Promise<CartModel> {
    const { id: userId } = user;

    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for the given user.');
    }

    return cart;
  }

  async addItemToCart(
    addItemToCartInput: AddItemToCartInput,
    user: UserModel,
  ): Promise<CartModel> {
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

  async removeCartItem(
    cartItemIdDto: IdDto,
    user: UserModel,
  ): Promise<boolean> {
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

  async calculateTotal(user: UserModel): Promise<TotalCartResponse> {
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
