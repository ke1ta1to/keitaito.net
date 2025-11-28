import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { PasswordService } from '@/auth/password.service';
import { PrismaFilter } from '@/prisma/prisma.filter';
import { PrismaService } from '@/prisma/prisma.service';

describe('POST /auth/sign-up (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
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

  it('should create a new user and return an access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'new-user@example.com',
        password: 'Password!',
      })
      .expect(201);

    expect(typeof res.body.access_token).toBe('string');
    expect(res.body.access_token.length).toBeGreaterThan(0);

    const created = await prismaService.user.findUnique({
      where: { email: 'new-user@example.com' },
    });
    expect(created).not.toBeNull();
    if (created === null) return;
    expect(created.email).toBe('new-user@example.com');
    expect(created.password).not.toBe('Password!');
    await expect(
      passwordService.compare('Password!', created.password),
    ).resolves.toBe(true);
  });

  it('should return 409 when the email already exists', async () => {
    await prismaService.user.create({
      data: {
        email: 'duplicate-user@example.com',
        password: await passwordService.hash('Password!'),
      },
    });

    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'duplicate-user@example.com',
        password: 'Password!',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(409);
        expect(typeof body.message).toBe('string');
        expect(body.message.length).toBeGreaterThan(0);
      });
  });
});
