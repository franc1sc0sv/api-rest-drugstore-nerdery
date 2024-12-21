import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import { parse } from 'yaml';

import { SwaggerModule } from '@nestjs/swagger';

import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // pipes
  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  // prisma exeption filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // config
  const configService = app.get(ConfigService);

  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const portEnv = configService.get<number>('PORT');

  // swagger
  const swaggerYaml = fs.readFileSync('swagger-api.yml', 'utf8');
  const swaggerDocument = parse(swaggerYaml);
  const document = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup(swaggerConfig.path || 'api', app, document);

  // cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(portEnv || nestConfig.port || 3000);
}
bootstrap();
