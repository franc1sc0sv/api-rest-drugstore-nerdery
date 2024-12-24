import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CategoryResponse } from './dtos/response/category-response.dto';
import { CreateCategoryInput } from './dtos/request/create-category.input';
import { UpdateCategoryInput } from './dtos/request/update-category.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoryService: CategoriesService) {}

  @Query(() => [CategoryResponse])
  async getCategories() {
    return this.categoryService.getAllCategories();
  }

  @Query(() => CategoryResponse)
  async getCategory(@Args('id') id: string) {
    return this.categoryService.getCategoryByID(id);
  }

  @Mutation(() => CategoryResponse)
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.createCategory(createCategoryInput);
  }

  @Mutation(() => CategoryResponse)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateCategory(
    @Args('id') id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async deleteCategory(@Args('id') id: string) {
    return this.categoryService.removeCategory(id);
  }
}
