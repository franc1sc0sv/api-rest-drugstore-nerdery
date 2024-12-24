import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  providers: [CategoriesService, CategoriesResolver, JwtStrategy],
})
export class CategoriesModule {}
