import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { PrismaFilter } from '@/prisma/prisma.filter';
import { PrismaService } from '@/prisma/prisma.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let accessToken: string;
  let seedUserId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaFilter(httpAdapter));
    prismaService = app.get(PrismaService);
    const authService = app.get(AuthService);
    await app.init();

    await prismaService.user.deleteMany();
    const seedUser = await prismaService.user.create({
      data: {
        email: 'test-user@example.com',
        name: 'Test User',
        password: 'Password!',
      },
    });
    seedUserId = seedUser.id;
    const signInRes = await authService.signIn({
      email: 'test-user@example.com',
      password: 'Password!',
    });
    accessToken = signInRes.access_token;
  });

  describe('GET /users', () => {
    it('should return users without password field', async () => {
      await prismaService.user.create({
        data: {
          email: 'second-user@example.com',
          name: 'Second User',
          password: 'Password!',
        },
      });

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          const users = body as Array<Record<string, unknown>>;
          expect(users.length).toBeGreaterThanOrEqual(1);
          users.forEach((user) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('createdAt');
            expect(user).toHaveProperty('updatedAt');
            expect(user).not.toHaveProperty('password');
            expect(typeof user.createdAt).toBe('string');
            expect(typeof user.updatedAt).toBe('string');
          });
          const created = users.find(
            (user) => user.email === 'second-user@example.com',
          );
          expect(created).toBeDefined();
          expect(created).toMatchObject({
            email: 'second-user@example.com',
            name: 'Second User',
          });
        });
    });

    it('should return 401 when authorization header is missing', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('GET /users/:id', () => {
    it('should return the requested user', () => {
      return request(app.getHttpServer())
        .get(`/users/${seedUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBe(seedUserId);
          expect(body.email).toBe('test-user@example.com');
          expect(body.name).toBe('Test User');
          expect(body.password).toBeUndefined();
          expect(typeof body.createdAt).toBe('string');
          expect(typeof body.updatedAt).toBe('string');
        });
    });

    it('should return 401 when authorization header is missing', () => {
      return request(app.getHttpServer())
        .get(`/users/${seedUserId}`)
        .expect(401);
    });

    it('should return 404 when the user does not exist', () => {
      return request(app.getHttpServer())
        .get('/users/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(404);
          expect(typeof body.message).toBe('string');
          expect(body.message.length).toBeGreaterThan(0);
        });
    });
  });
});
