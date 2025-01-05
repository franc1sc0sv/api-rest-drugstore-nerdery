import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dtos/request/create-category.input';
import { UpdateCategoryInput } from './dtos/request/update-category.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CategoryModel } from 'src/common/models/category.model';
import { UnifiedAuthGuard } from 'src/common/guards/unified-auth.guard';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoryService: CategoriesService) {}

  @Query(() => [CategoryModel])
  async getCategories(): Promise<CategoryModel[]> {
    return this.categoryService.getAllCategories();
  }

  @Query(() => CategoryModel)
  async getCategory(@Args('id') id: string): Promise<CategoryModel> {
    return this.categoryService.getCategoryByID(id);
  }

  @Mutation(() => CategoryModel)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(createCategoryInput);
  }

  @Mutation(() => CategoryModel)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async updateCategory(
    @Args('id') id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async deleteCategory(@Args('id') id: string): Promise<boolean> {
    return this.categoryService.removeCategory(id);
  }
}
