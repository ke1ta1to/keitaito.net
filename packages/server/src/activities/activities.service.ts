import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

import { DbService } from 'src/db/db.service';
import { activitiesTable, Activity } from 'src/db/schema';

@Injectable()
export class ActivitiesService {
  constructor(private readonly dbService: DbService) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const [activity] = await this.dbService.db
      .insert(activitiesTable)
      .values(createActivityDto)
      .returning();
    return activity;
  }

  async findAll(): Promise<Activity[]> {
    return await this.dbService.db.select().from(activitiesTable);
  }

  async findOne(id: number): Promise<Activity | null> {
    const activities = await this.dbService.db
      .select()
      .from(activitiesTable)
      .where(eq(activitiesTable.id, id))
      .limit(1);
    if (activities.length === 0) {
      return null;
    }
    return activities[0];
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    return (
      await this.dbService.db
        .update(activitiesTable)
        .set(updateActivityDto)
        .where(eq(activitiesTable.id, id))
        .returning()
    )[0];
  }

  async remove(id: number): Promise<Activity> {
    return (
      await this.dbService.db
        .delete(activitiesTable)
        .where(eq(activitiesTable.id, id))
        .returning()
    )[0];
  }
}
