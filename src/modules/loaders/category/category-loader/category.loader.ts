import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as DataLoader from 'dataloader';
import { CategoryModel } from 'src/common/models/category.model';

@Injectable({ scope: Scope.REQUEST })
export class CategoryLoader {
  constructor(private readonly prismaService: PrismaService) {}

  batchCategories = new DataLoader<string, CategoryModel>(
    async (categoryIds: string[]) => {
      const categories = await this.prismaService.category.findMany({
        where: { id: { in: categoryIds } },
      });

      const categoryMap = new Map(
        categories.map((category) => [category.id, category]),
      );

      return categoryIds.map((id) => categoryMap.get(id) || null);
    },
  );
}
