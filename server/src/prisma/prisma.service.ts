import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@/generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient<{
    log: [
      { emit: 'event'; level: 'info' },
      { emit: 'event'; level: 'query' },
      { emit: 'event'; level: 'warn' },
      { emit: 'event'; level: 'error' },
    ];
  }>
  implements OnModuleInit
{
  private readonly logger = new Logger('Prisma');

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.$on('info', (e) => this.logger.log(e.message));
    this.$on('query', (e) => this.logger.log(`Query: ${e.query}`));
    this.$on('warn', (e) => this.logger.warn(e.message));
    this.$on('error', (e) => this.logger.error(e.message));
    await this.$connect();
  }
}
