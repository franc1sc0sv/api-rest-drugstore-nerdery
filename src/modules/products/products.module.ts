import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { ImagesModule } from '../images/images.module';

@Module({
  providers: [ProductsService, ProductsResolver],
  imports: [ImagesModule],
})
export class ProductsModule {}
