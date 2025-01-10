import { Module } from '@nestjs/common';
import { ProductLoader } from './product/product-loader/product.loader';
import { ProductImageLoader } from './product/product-image-loader/product-image.loader';
import { CategoryLoader } from './category/category-loader/category.loader';
import { CartItemLoader } from './cart/cart-item/cart-item.loader';
import { OrderItemLoader } from './order/order-items/order-item.loader';
import { PaymentLoader } from './order/payments/payment.loader';

@Module({
  providers: [
    ProductLoader,
    ProductImageLoader,
    CategoryLoader,
    CartItemLoader,
    OrderItemLoader,
    PaymentLoader,
  ],
  exports: [
    ProductLoader,
    ProductImageLoader,
    CategoryLoader,
    CartItemLoader,
    OrderItemLoader,
    PaymentLoader,
  ],
})
export class LoadersModule {}
