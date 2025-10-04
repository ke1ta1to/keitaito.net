import { Injectable } from '@nestjs/common';

import { DbService } from './db/db.service';
import { usersTable } from './db/schema';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DbService) {}

  async getHello(): Promise<(typeof usersTable.$inferSelect)[]> {
    const users = await this.dbService.db.select().from(usersTable);
    return users;
  }
}
