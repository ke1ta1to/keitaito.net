import type { INestApplication } from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
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

describe('ActivitiesController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let accessToken: string;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    app.setGlobalPrefix('api');
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
    prismaService = app.get(PrismaService);
    passwordService = app.get(PasswordService);
    const authService = app.get(AuthService);

    await app.init();

    await prismaService.$transaction([
      prismaService.user.deleteMany(),
      prismaService.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          email: 'test-user@example.com',
          name: 'Test User',
          password: await passwordService.hash('Password!'),
        },
      }),
    ]);

    const signInRes = await authService.signIn({
      id: 1,
      email: 'test-user@example.com',
      name: 'Test User',
    });
    accessToken = signInRes.access_token;
  });

  describe('GET /api/v1/activities', () => {
    it('should return activities with expected properties', () => {
      return request(app.getHttpServer())
        .get('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as unknown;
          expect(Array.isArray(body)).toBe(true);
          const activities = body as Array<Record<string, unknown>>;
          activities.forEach((activity) => {
            expect(activity).toHaveProperty('id');
            expect(activity).toHaveProperty('title');
            expect(activity).toHaveProperty('dateText');
            expect(activity).toHaveProperty('createdAt');
            expect(activity).toHaveProperty('updatedAt');
          });
        });
    });

    it('should return 401 when no authorization token is provided', () => {
      return request(app.getHttpServer()).get('/api/v1/activities').expect(401);
    });
  });

  describe('POST /api/v1/activities', () => {
    it('should create and return the new activity', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: "activity's title",
          content: "activity's content",
          dateText: 'May 20, 2024',
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.title).toBe("activity's title");
          expect(body.content).toBe("activity's content");
          expect(body.dateText).toBe('May 20, 2024');
        });
    });

    it('should return 400 if title is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: "activity's content",
          dateText: 'May 20, 2024',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining(['title should not be null or undefined']),
          );
          expect(body.message).toHaveLength(1);
        });
    });

    it('should return 400 if dateText is missing', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: "activity's title",
          content: "activity's content",
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining([
              'dateText should not be null or undefined',
            ]),
          );
          expect(body.message).toHaveLength(1);
        });
    });

    it('should return 400 if extra properties are sent', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: "activity's title",
          content: "activity's content",
          dateText: 'May 20, 2024',
          extraProperty: 'extra',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining(['property extraProperty should not exist']),
          );
          expect(body.message).toHaveLength(1);
        });
    });

    it('should return 400 if title is null', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: null,
          content: "activity's content",
          dateText: 'May 20, 2024',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining(['title should not be null or undefined']),
          );
          expect(body.message).toHaveLength(1);
        });
    });

    it('should return 400 if dateText is null', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: "activity's title",
          content: "activity's content",
          dateText: null,
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining([
              'dateText should not be null or undefined',
            ]),
          );
          expect(body.message).toHaveLength(1);
        });
    });

    it('should return 400 if title and dateText are null', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: null,
          content: "activity's content",
          dateText: null,
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe('Bad Request');
          expect(body.message).toEqual(
            expect.arrayContaining([
              'dateText should not be null or undefined',
              'title should not be null or undefined',
            ]),
          );
          expect(body.message).toHaveLength(2);
        });
    });

    it('should return 401 when no authorization token is provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/activities')
        .send({
          title: "activity's title",
          content: "activity's content",
          dateText: 'May 20, 2024',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/activities/:id', () => {
    it('should return the requested activity', async () => {
      const created = await prismaService.activity.create({
        data: {
          title: 'activity for get one',
          content: 'activity content',
          dateText: 'May 21, 2024',
          userId: 1,
        },
      });
      return request(app.getHttpServer())
        .get(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBe(created.id);
          expect(body.title).toBe('activity for get one');
          expect(body.content).toBe('activity content');
          expect(body.dateText).toBe('May 21, 2024');
        });
    });

    it('should return 404 when activity does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/v1/activities/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(404);
          expect(typeof body.message).toBe('string');
          expect(body.message.length).toBeGreaterThan(0);
        });
    });

    it('should return 401 when no authorization token is provided', () => {
      return request(app.getHttpServer())
        .get('/api/v1/activities/1')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/activities/:id', () => {
    it('should update and return the activity when id matches user', async () => {
      const created = await prismaService.activity.create({
        data: {
          id: 1,
          title: 'activity to update',
          content: 'before update',
          dateText: 'May 22, 2024',
          userId: 1,
        },
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'activity updated title',
          content: 'after update',
        })
        .expect(200)
        .expect(({ body: updatedBody }) => {
          expect(updatedBody.id).toBe(created.id);
          expect(updatedBody.title).toBe('activity updated title');
          expect(updatedBody.content).toBe('after update');
          expect(updatedBody.dateText).toBe('May 22, 2024');
        });
    });

    it('should return 403 when activity owner differs from user', async () => {
      const created = await prismaService.activity.create({
        data: {
          title: 'activity forbidden update',
          content: 'do not update owner mismatch',
          dateText: 'May 22, 2024',
          user: {
            create: {
              id: 2,
              email: 'other-user@example.com',
              name: 'Other User',
              password: await passwordService.hash('Password!'),
            },
          },
        },
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'attempted update title',
        })
        .expect(403);
    });

    it('should return 400 if extra properties are sent', async () => {
      const created = await prismaService.activity.create({
        data: {
          id: 1,
          title: 'activity to update with extra',
          content: 'before update extra',
          dateText: 'May 23, 2024',
          userId: 1,
        },
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'should not update',
          extraProperty: 'extra',
        })
        .expect(400)
        .expect(({ body: errorBody }) => {
          expect(errorBody.statusCode).toBe(400);
          expect(errorBody.error).toBe('Bad Request');
          expect(errorBody.message).toEqual(
            expect.arrayContaining(['property extraProperty should not exist']),
          );
        });
    });

    it('should return 404 when activity to update does not exist', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/activities/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'non-existent activity',
        })
        .expect(404)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(404);
          expect(typeof body.message).toBe('string');
          expect(body.message.length).toBeGreaterThan(0);
        });
    });

    it('should return 401 when no authorization token is provided', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/activities/1')
        .send({
          title: 'attempted update without auth',
        })
        .expect(401);
    });
  });

  describe('DELETE /api/v1/activities/:id', () => {
    it('should delete the activity without response body when id matches user', async () => {
      const created = await prismaService.activity.create({
        data: {
          id: 1,
          title: 'activity to delete',
          content: 'to be deleted',
          dateText: 'May 24, 2024',
          userId: 1,
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const deleted = await prismaService.activity.findUnique({
        where: { id: created.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 403 when activity owner differs from user', async () => {
      const created = await prismaService.activity.create({
        data: {
          title: 'activity forbidden delete',
          content: 'still there',
          dateText: 'May 24, 2024',
          user: {
            create: {
              id: 2,
              email: 'other-user-delete@example.com',
              name: 'Other User Delete',
              password: await passwordService.hash('Password!'),
            },
          },
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/activities/${created.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      const existing = await prismaService.activity.findUnique({
        where: { id: created.id },
      });
      expect(existing).not.toBeNull();
    });

    it('should return 404 when activity to delete does not exist', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/activities/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(404);
          expect(typeof body.message).toBe('string');
          expect(body.message.length).toBeGreaterThan(0);
        });
    });

    it('should return 401 when no authorization token is provided', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/activities/1')
        .expect(401);
    });
  });
});
