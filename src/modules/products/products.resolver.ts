import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductResponse } from './dtos/response/product-reponse.dto';
import { CreateProductInput } from './dtos/request/create-products.input';
import { IdDto } from 'src/common/dtos/id.dto';
import { UploadProductImageInput } from './dtos/request/upload-product-images.input';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductResponse)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<ProductResponse> {
    return this.productsService.createProduct(createProductInput);
  }

  @Mutation(() => ProductResponse)
  async addImagesToProduct(
    @Args('productId') productIdDto: IdDto,
    @Args('uploadProductImageInput', { type: () => [UploadProductImageInput] })
    uploadProductImageInput: UploadProductImageInput[],
  ): Promise<ProductResponse> {
    return this.productsService.addImagesToProduct(
      productIdDto,
      uploadProductImageInput,
    );
  }

  @Mutation(() => Boolean)
  async removeImageFromProduct(
    @Args('productId') productIdDto: IdDto,
    @Args('imageUrl') imageIdDto: IdDto,
  ): Promise<boolean> {
    return this.productsService.removeImageFromProduct(
      productIdDto,
      imageIdDto,
    );
  }
}
