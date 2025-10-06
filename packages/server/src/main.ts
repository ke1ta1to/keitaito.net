import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { DbFilter } from './db/db.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  const configService = app.get(ConfigService);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DbFilter(httpAdapter));

  const config = new DocumentBuilder().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(configService.getOrThrow('PORT'));
}

void bootstrap();
