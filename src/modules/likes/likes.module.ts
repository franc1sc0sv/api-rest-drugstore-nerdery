import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { LoadersModule } from '../loaders/loaders.module';

@Module({
  imports: [LoadersModule],
  providers: [LikesService, LikesResolver],
})
export class LikesModule {}
