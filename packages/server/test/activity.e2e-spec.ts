import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from 'src/app.module';

describe('ActivitiesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/activities (GET)', () => {
    return request(app.getHttpServer()).get('/activities').expect(200);
  });

  it('/activities (POST)', () => {
    return request(app.getHttpServer())
      .post('/activities')
      .send({
        title: 'Test Activity',
        dateText: 'Mar. 2025',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });
});
