import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { ImagesModule } from '../images/images.module';
import { LoadersModule } from '../loaders/loaders.module';

@Module({
  imports: [ImagesModule, LoadersModule],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
