import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}

void bootstrap();
