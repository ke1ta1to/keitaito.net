import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';

import { AuthService } from '@/auth/auth.service';
import { PasswordService } from '@/auth/password.service';
import { PrismaService } from '@/prisma/prisma.service';

export async function createTestUser(app: INestApplication<App>) {
  const prismaService = app.get(PrismaService);
  const passwordService = app.get(PasswordService);
  const authService = app.get(AuthService);

  const hashedPassword = await passwordService.hash('Password!');
  const user = await prismaService.user.upsert({
    where: { email: 'test-user@example.com' },
    update: {},
    create: {
      email: 'test-user@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });
  const signUpRes = await authService.signIn({ id: user.id });
  return { userId: user.id, accessToken: signUpRes.access_token };
}
