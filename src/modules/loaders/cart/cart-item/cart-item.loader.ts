import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as DataLoader from 'dataloader';
import { CartItemModel } from 'src/common/models/cart-item.model';

@Injectable({ scope: Scope.REQUEST })
export class CartItemLoader {
  constructor(private readonly prismaService: PrismaService) {}

  batchCartItems = new DataLoader<string, CartItemModel[]>(
    async (cartIds: string[]) => {
      const cartItems = await this.prismaService.cartItem.findMany({
        where: { cartId: { in: cartIds } },
        include: { product: true },
      });

      const cartItemsMap = new Map<string, CartItemModel[]>();
      cartIds.forEach((cartId) => cartItemsMap.set(cartId, []));

      cartItems.forEach((item) => {
        if (cartItemsMap.has(item.cartId)) {
          cartItemsMap.get(item.cartId)?.push(item);
        }
      });

      return cartIds.map((id) => cartItemsMap.get(id) || []);
    },
  );
}
