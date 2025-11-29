import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import { createTestApp } from './utils/create-app';

import { AuthService } from '@/auth/auth.service';
import { PasswordService } from '@/auth/password.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let accessToken: string;
  let userId: number;
  let passwordService: PasswordService;

  beforeEach(async () => {
    app = await createTestApp();
    await app.init();

    prismaService = app.get(PrismaService);
    passwordService = app.get(PasswordService);
    const authService = app.get(AuthService);
    await prismaService.user.deleteMany();
    const hashedPassword = await passwordService.hash('Password!');
    const user = await prismaService.user.upsert({
      where: { email: 'test-user@example.com' },
      update: {},
      create: {
        email: 'test-user@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });
    userId = user.id;
    const signUpRes = await authService.signIn({ id: userId });
    accessToken = signUpRes.access_token;
  });

  describe('GET /v1/users', () => {
    it('should return users without password field', async () => {
      await prismaService.user.create({
        data: {
          email: 'second-user@example.com',
          name: 'Second User',
          password: await passwordService.hash('Password!'),
        },
      });

      return request(app.getHttpServer())
        .get('/v1/users')
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
      return request(app.getHttpServer()).get('/v1/users').expect(401);
    });
  });

  describe('GET /v1/users/:id', () => {
    it('should return the requested user', () => {
      return request(app.getHttpServer())
        .get(`/v1/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBe(userId);
          expect(body.email).toBe('test-user@example.com');
          expect(body.name).toBe('Test User');
          expect(body.password).toBeUndefined();
          expect(typeof body.createdAt).toBe('string');
          expect(typeof body.updatedAt).toBe('string');
        });
    });

    it('should return 401 when authorization header is missing', () => {
      return request(app.getHttpServer())
        .get(`/v1/users/${userId}`)
        .expect(401);
    });

    it('should return 404 when the user does not exist', () => {
      return request(app.getHttpServer())
        .get('/v1/users/999999')
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
