import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import type { ActivityResponseDto } from './dto/activity.response.dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let activitiesService: jest.Mocked<ActivitiesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    activitiesService = module.get(ActivitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const dto = {
        title: 'New Activity',
        dateText: '2024-10-10',
      };
      const createdActivity: ActivityResponseDto = {
        id: 1,
        userId: 1,
        title: dto.title,
        content: null,
        dateText: dto.dateText,
        createdAt: new Date('2024-10-10T00:00:00.000Z'),
        updatedAt: new Date('2024-10-10T00:00:00.000Z'),
      };
      activitiesService.create.mockResolvedValue(createdActivity);

      const result = await controller.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(activitiesService.create).toHaveBeenCalledWith({
        data: { ...dto, user: { connect: { id: 1 } } },
      });
      expect(result).toEqual(createdActivity);
    });
  });

  describe('findAll', () => {
    it('should return all activities', async () => {
      const activities: ActivityResponseDto[] = [
        {
          id: 1,
          userId: 1,
          title: 'Activity',
          content: null,
          dateText: '2024-10-10',
          createdAt: new Date('2024-10-10T00:00:00.000Z'),
          updatedAt: new Date('2024-10-10T00:00:00.000Z'),
        },
      ];
      activitiesService.findAll.mockResolvedValue(activities);

      const result = await controller.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(activitiesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(activities);
    });
  });

  describe('findOne', () => {
    it('should return a single activity', async () => {
      const id = 1;
      const activity: ActivityResponseDto = {
        id,
        userId: 1,
        title: 'Activity',
        content: null,
        dateText: '2024-10-10',
        createdAt: new Date('2024-10-10T00:00:00.000Z'),
        updatedAt: new Date('2024-10-10T00:00:00.000Z'),
      };
      activitiesService.findOne.mockResolvedValue(activity);

      const result = await controller.findOne(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(activitiesService.findOne).toHaveBeenCalledWith({ id });
      expect(result).toEqual(activity);
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const id = 1;
      const updateDto = { title: 'Updated Activity', dateText: '2024-10-11' };
      const updatedActivity: ActivityResponseDto = {
        id,
        userId: 1,
        title: updateDto.title,
        content: null,
        dateText: updateDto.dateText,
        createdAt: new Date('2024-10-10T00:00:00.000Z'),
        updatedAt: new Date('2024-10-11T00:00:00.000Z'),
      };
      activitiesService.update.mockResolvedValue(updatedActivity);

      const result = await controller.update(id, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(activitiesService.update).toHaveBeenCalledWith({
        id,
        data: updateDto,
      });
      expect(result).toEqual(updatedActivity);
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      const id = 1;
      const deletedActivity: ActivityResponseDto = {
        id,
        userId: 1,
        title: 'To Delete',
        content: null,
        dateText: '2024-10-10',
        createdAt: new Date('2024-10-10T00:00:00.000Z'),
        updatedAt: new Date('2024-10-10T00:00:00.000Z'),
      };
      activitiesService.remove.mockResolvedValue(deletedActivity);

      const result = await controller.remove(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(activitiesService.remove).toHaveBeenCalledWith({ id });
      expect(result).toEqual(deletedActivity);
    });
  });
});
