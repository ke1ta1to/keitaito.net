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

describe('AuthController (e2e)', () => {
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

  describe('POST /auth/sign-up', () => {
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

  describe('POST /auth/sign-in', () => {
    it('should return an access token for valid credentials', async () => {
      await prismaService.user.create({
        data: {
          email: 'signin-user@example.com',
          password: await passwordService.hash('Password!'),
        },
      });

      const res = await request(app.getHttpServer())
        .post('/auth/sign-in')
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
        .post('/auth/sign-in')
        .send({
          email: 'not-exist@example.com',
          password: 'wrong-password',
        })
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
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
});
