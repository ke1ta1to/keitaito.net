import type { Activity as ActivityType } from 'src/db/schema';

export class Activity implements ActivityType {
  id: number;
  userId: number | null;
  title: string;
  description: string;
  dateText: string;
}
