import { Module } from '@nestjs/common';
import { ProductLoader } from './product/product-loader/product.loader';
import { ProductImageLoader } from './product/product-image-loader/product-image.loader';
import { CategoryLoader } from './category/category-loader/category.loader';

@Module({
  providers: [ProductLoader, ProductImageLoader, CategoryLoader],
  exports: [ProductLoader, ProductImageLoader, CategoryLoader],
})
export class LoadersModule {}
