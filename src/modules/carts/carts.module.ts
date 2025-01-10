import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsResolver } from './carts.resolver';
import { LoadersModule } from '../loaders/loaders.module';

@Module({
  imports: [LoadersModule],
  providers: [CartsService, CartsResolver],
})
export class CartsModule {}
