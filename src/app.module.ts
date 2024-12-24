import { Module } from '@nestjs/common';

import config from './configs/config';
import { validate } from './configs/env/env.validation';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './configs/graphql/gql.config.service';
import { AuthModule } from './modules/auth/auth.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
