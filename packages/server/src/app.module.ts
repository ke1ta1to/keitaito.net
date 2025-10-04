import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ActivitiesModule],
})
export class AppModule {}
