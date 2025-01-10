import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { OrderItemModel } from 'src/common/models/order-item.model';
import { PrismaService } from 'nestjs-prisma';

@Injectable({ scope: Scope.REQUEST })
export class OrderItemLoader {
  constructor(private readonly prisma: PrismaService) {}

  public readonly batchOrderItems = new DataLoader<string, OrderItemModel[]>(
    async (orderIds: readonly string[]) => {
      const orderItems = await this.prisma.orderItem.findMany({
        where: { orderId: { in: [...orderIds] } },
        include: { product: true },
      });

      const orderItemsMap = orderIds.map((orderId) =>
        orderItems.filter((orderItem) => orderItem.orderId === orderId),
      );

      return orderItemsMap;
    },
  );
}
