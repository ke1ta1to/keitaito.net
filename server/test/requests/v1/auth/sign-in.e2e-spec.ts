import type { INestApplication } from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { PasswordService } from '@/auth/password.service';
import { PrismaFilter } from '@/prisma/prisma.filter';
import { PrismaService } from '@/prisma/prisma.service';

describe('POST /v1/auth/sign-in (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ['1'],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaFilter(httpAdapter));

    await app.init();

    prismaService = app.get(PrismaService);
    passwordService = app.get(PasswordService);
    await prismaService.user.deleteMany();
  });

  it('should return an access token for valid credentials', async () => {
    await prismaService.user.create({
      data: {
        email: 'signin-user@example.com',
        password: await passwordService.hash('Password!'),
      },
    });

    const res = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'signin-user@example.com',
        password: 'Password!',
      })
      .expect(200);

    expect(typeof res.body.access_token).toBe('string');
    expect(res.body.access_token.length).toBeGreaterThan(0);
  });

  it('should return 401 for invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'not-exist@example.com',
        password: 'wrong-password',
      })
      .expect(401);
  });
});
