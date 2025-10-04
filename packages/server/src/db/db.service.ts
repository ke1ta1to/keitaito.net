import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);

  private client: Client;
  public db: NodePgDatabase;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      connectionString: this.configService.getOrThrow<string>('DATABASE_URL'),
    });
    await this.client.connect();
    this.db = drizzle(this.client);
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.client.end();
    this.logger.log('Database disconnected');
  }
}
