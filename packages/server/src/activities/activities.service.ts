import { Injectable } from '@nestjs/common';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

import { DbService } from 'src/db/db.service';
import { activitiesTable } from 'src/db/schema';

@Injectable()
export class ActivitiesService {
  constructor(private readonly dbService: DbService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }

  async findAll() {
    return await this.dbService.db.select().from(activitiesTable);
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
