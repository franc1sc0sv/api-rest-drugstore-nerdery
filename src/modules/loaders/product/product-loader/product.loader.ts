import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as DataLoader from 'dataloader';
import { ProductModel } from 'src/common/models/product.model';

@Injectable({ scope: Scope.REQUEST })
export class ProductLoader {
  constructor(private readonly prismaService: PrismaService) {}

  batchPorducts = new DataLoader<string, ProductModel>(
    async (productIds: string[]) => {
      const products = await this.prismaService.product.findMany({
        where: { id: { in: productIds } },
      });
      const productsMap = new Map(
        products.map((product) => [product.id, product]),
      );
      return productIds.map((id) => productsMap.get(id) || null);
    },
  );
}
