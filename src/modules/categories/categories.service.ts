import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryInput } from './dtos/request/create-category.input';
import { UpdateCategoryInput } from './dtos/request/update-category.input';
import { CategoryDto } from 'src/common/dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(): Promise<CategoryDto[]> {
    return this.prismaService.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        subCategories: true,
        parent: true,
      },
    });
  }

  async getCategoryByID(id: string): Promise<CategoryDto> {
    const category = this.prismaService.category.findFirst({
      where: { id },
      include: {
        subCategories: true,
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async createCategory(data: CreateCategoryInput): Promise<CategoryDto> {
    const { name } = data;

    const isCategoryRepeted = await this.prismaService.category.findFirst({
      where: { name },
    });
    if (isCategoryRepeted) {
      throw new ConflictException('Category name already in use');
    }
    return this.prismaService.category.create({
      data,
    });
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
  ): Promise<CategoryDto> {
    return this.prismaService.category.update({
      where: { id },
      data,
    });
  }

  async removeCategory(id: string): Promise<boolean> {
    await this.prismaService.category.delete({
      where: { id },
    });
    return true;
  }
}
