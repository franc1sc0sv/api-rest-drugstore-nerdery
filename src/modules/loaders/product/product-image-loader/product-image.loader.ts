import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as DataLoader from 'dataloader';
import { ProductImageModel } from 'src/common/models/product-image.model';

@Injectable({ scope: Scope.REQUEST })
export class ProductImageLoader {
  constructor(private readonly prismaService: PrismaService) {}

  batchProductImages = new DataLoader<string, ProductImageModel[]>(
    async (productIds: string[]) => {
      const images = await this.prismaService.productImage.findMany({
        where: { productId: { in: productIds } },
      });

      const imagesMap = productIds.reduce(
        (acc, id) => {
          acc[id] = images.filter((image) => image.productId === id);
          return acc;
        },
        {} as Record<string, ProductImageModel[]>,
      );

      return productIds.map((id) => imagesMap[id] || []);
    },
  );
}
