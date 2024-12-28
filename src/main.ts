import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import * as fs from 'fs';
import { parse } from 'yaml';

import { SwaggerModule } from '@nestjs/swagger';

import { NestConfig, SwaggerConfig } from './configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);

  const nestConfig = configService.get<NestConfig>('nest');

  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const portEnv = configService.get<number>('PORT');

  const swaggerYaml = fs.readFileSync('swagger-api.yml', 'utf8');
  const swaggerDocument = parse(swaggerYaml);
  const document = SwaggerModule.createDocument(app, swaggerDocument);

  SwaggerModule.setup(swaggerConfig.path || 'api', app, document);

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.enableCors();

  await app.listen(portEnv || nestConfig.port || 3000);
}
bootstrap();
