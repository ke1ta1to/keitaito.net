import type { Activity } from '@/generated/prisma';

export class ActivityResponseDto implements Activity {
  id: number;
  title: string;
  content: string | null;
  dateText: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
