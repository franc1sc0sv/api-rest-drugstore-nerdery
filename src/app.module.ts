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
import { seedProducts } from './seeds/seed-products';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', 'static'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 0,
        limit: 0,
      },
    ]),
    AuthModule,
    CategoriesModule,
    ImagesModule,
    ProductsModule,
    CartsModule,
    LikesModule,
    MailsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await seed();
    await seedCategories();
    await seedProducts();
  }
}
