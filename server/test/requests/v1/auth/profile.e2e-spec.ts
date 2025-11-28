import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { PasswordService } from '@/auth/password.service';
import { PrismaFilter } from '@/prisma/prisma.filter';
import { PrismaService } from '@/prisma/prisma.service';

describe('GET /auth/profile (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let passwordService: PasswordService;
  let authService: AuthService;

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
    authService = app.get(AuthService);
    await prismaService.user.deleteMany();
  });

  it('should return profile when authorized', async () => {
    const user = await prismaService.user.create({
      data: {
        email: 'profile-user@example.com',
        name: 'Profile User',
        password: await passwordService.hash('Password!'),
      },
    });
    const { access_token } = await authService.signIn({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(user.id);
        expect(body.email).toBe('profile-user@example.com');
        expect(body.name).toBe('Profile User');
        expect(body).not.toHaveProperty('password');
      });
  });

  it('should return 401 when authorization header is missing', () => {
    return request(app.getHttpServer()).get('/auth/profile').expect(401);
  });
});
