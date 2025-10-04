import type { usersTable } from 'src/db/schema';

type User = typeof usersTable.$inferSelect;

export class CreateActivityDto implements User {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
