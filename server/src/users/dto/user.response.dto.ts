import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import type { User } from '@/generated/prisma';

export class UserResponseDto implements User {
  id: number;
  name: string | null;
  email: string;
  @Exclude() @ApiHideProperty() password: string;
  createdAt: Date;
  updatedAt: Date;
}
