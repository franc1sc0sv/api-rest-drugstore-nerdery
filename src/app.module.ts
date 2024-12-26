import { Module, OnModuleInit } from '@nestjs/common';

import config from './configs/config';
import { validate } from './configs/env/env.validation';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './configs/graphql/gql.config.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { seed } from './seeds/seed';
import { seedCategories } from './seeds/seed-categories';
import { ImagesModule } from './modules/images/images.module';
import { ProductsModule } from './modules/products/products.module';
import { CartsModule } from './modules/carts/carts.module';
import { LikesModule } from './modules/likes/likes.module';
import { MailsModule } from './modules/mails/mails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
      validate,
      load: [config],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoriesModule,
    ImagesModule,
    ProductsModule,
    CartsModule,
    LikesModule,
    MailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await seed();
      await seedCategories();
    }
  }
}
