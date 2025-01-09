import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';

import config from './configs/global.config';
import { validate } from './configs/env/env.config';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './configs/graphql/gql.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';

import { seedCategories } from './seeds/seed-categories.seed';
import { ImagesModule } from './modules/images/images.module';
import { ProductsModule } from './modules/products/products.module';
import { CartsModule } from './modules/carts/carts.module';
import { LikesModule } from './modules/likes/likes.module';
import { MailsModule } from './modules/mails/mails.module';
import { seedProducts } from './seeds/seed-products.seed';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { OrdersModule } from './modules/orders/orders.module';
import { StripeModule } from './modules/orders/stripe.module';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import * as bodyParser from 'body-parser';
import { seed } from './seeds/seed-users.seed';
import { LoadersModule } from './modules/loaders/loaders.module';

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
    OrdersModule,
    StripeModule,
    LoadersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.raw({ type: 'application/json' }))
      .forRoutes('webhook/stripe');
  }

  async onModuleInit() {
    await seed();
    await seedCategories();
    await seedProducts();
  }
}
