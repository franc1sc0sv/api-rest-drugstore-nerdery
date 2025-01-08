import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dtos/request/create-products.input';
import { IdDto } from 'src/common/dtos/id.dto';
import { UploadProductImageInput } from './dtos/request/upload-product-images.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateProductStatusInput } from './dtos/request/update-product-status.input';
import { UpdateProductInput } from './dtos/request/update-products.input';
import { GetProductsInput } from './dtos/request/get-products.input';
import { ProductModel } from 'src/common/models/product.model';
import { UnifiedAuthGuard } from 'src/common/guards/unified-auth.guard';
import { GetProductsResponse } from './dtos/response/get-products.response';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => GetProductsResponse)
  async getProducts(
    @Args('getProductsInput') getProductsInput: GetProductsInput,
  ): Promise<GetProductsResponse> {
    return this.productsService.getProducts(getProductsInput);
  }

  @Query(() => ProductModel)
  async getProductById(@Args('productIdDto') productIdDto: IdDto) {
    return this.productsService.getProductById(productIdDto);
  }

  @Mutation(() => ProductModel)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async updateProductDetails(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<ProductModel> {
    return this.productsService.updateProductDetails(
      productIdDto,
      updateProductInput,
    );
  }

  @Mutation(() => ProductModel)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async updateProductStatus(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('updateProductStatusdInput')
    updateProductStatusdInput: UpdateProductStatusInput,
  ): Promise<ProductModel> {
    return this.productsService.updateProductStatus(
      productIdDto,
      updateProductStatusdInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async deleteProduct(
    @Args('productIdDto') productIdDto: IdDto,
  ): Promise<boolean> {
    return this.productsService.deleteProduct(productIdDto);
  }

  @Mutation(() => ProductModel)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<ProductModel> {
    return this.productsService.createProduct(createProductInput);
  }

  @Mutation(() => ProductModel)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async addImagesToProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('uploadProductImageInput', { type: () => [UploadProductImageInput] })
    uploadProductImageInput: UploadProductImageInput[],
  ): Promise<ProductModel> {
    return this.productsService.addImagesToProduct(
      productIdDto,
      uploadProductImageInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(Role.MANAGER)
  @UseGuards(UnifiedAuthGuard, RolesGuard)
  async removeImageFromProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('imageUrlDto') imageIdDto: IdDto,
  ): Promise<boolean> {
    return this.productsService.removeImageFromProduct(
      productIdDto,
      imageIdDto,
    );
  }
}
