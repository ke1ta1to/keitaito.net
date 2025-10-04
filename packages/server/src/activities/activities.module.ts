import { Module } from '@nestjs/common';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, DbService],
})
export class ActivitiesModule {}
