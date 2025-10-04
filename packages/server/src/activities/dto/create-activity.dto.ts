import type { activitiesTable } from 'src/db/schema';

type ActivityInsert = typeof activitiesTable.$inferInsert;

export class CreateActivityDto implements ActivityInsert {
  title: string;
  description: string;
  dateText: string;
  userId?: number | null | undefined;
}
