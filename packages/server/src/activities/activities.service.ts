import { Injectable } from '@nestjs/common';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor() {}

  create(createActivityDto: CreateActivityDto) {
    return {};
  }

  findAll() {
    return {};
  }

  findOne(id: number) {
    return {};
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return {};
  }

  remove(id: number) {}
}
