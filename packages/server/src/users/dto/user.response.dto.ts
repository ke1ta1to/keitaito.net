import type { User } from '@/generated/prisma';

export class UserResponseDto implements User {
  id: number;
  name: string | null;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
