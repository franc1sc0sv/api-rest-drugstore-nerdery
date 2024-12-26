import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductResponse } from './dtos/response/product-reponse.dto';
import { CreateProductInput } from './dtos/request/create-products.input';
import { IdDto } from 'src/common/dtos/id.dto';
import { UploadProductImageInput } from './dtos/request/upload-product-images.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateProductStatusInput } from './dtos/request/update-product-status.input';
import { UpdateProductInput } from './dtos/request/update-products.input';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductResponse)
  async getProductById(@Args('productIdDto') productIdDto: IdDto) {
    return this.productsService.getProductById(productIdDto);
  }

  @Mutation(() => ProductResponse)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateProductDetails(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.updateProductDetails(
      productIdDto,
      updateProductInput,
    );
  }

  @Mutation(() => ProductResponse)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateProductStatus(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('updateProductStatusdInput')
    updateProductStatusdInput: UpdateProductStatusInput,
  ) {
    return this.productsService.updateProductStatus(
      productIdDto,
      updateProductStatusdInput,
    );
  }

  @Mutation(() => ProductResponse)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteProduct(@Args('productIdDto') productIdDto: IdDto) {
    return this.productsService.deleteProduct(productIdDto);
  }

  @Mutation(() => ProductResponse)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<ProductResponse> {
    return this.productsService.createProduct(createProductInput);
  }

  @Mutation(() => ProductResponse)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async addImagesToProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @Args('uploadProductImageInput', { type: () => [UploadProductImageInput] })
    uploadProductImageInput: UploadProductImageInput[],
  ): Promise<ProductResponse> {
    return this.productsService.addImagesToProduct(
      productIdDto,
      uploadProductImageInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, RolesGuard)
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
