import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ActivitiesService } from './activities.service';

import { PrismaService } from '@/prisma/prisma.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    prismaServiceMock = {
      activity: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
