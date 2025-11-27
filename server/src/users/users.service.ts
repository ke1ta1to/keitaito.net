import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOneOrThrow(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, hashedPassword: string) {
    const exist = await this.prisma.user.findUnique({ where: { email } });
    if (exist !== null) {
      throw new ConflictException('Email already in use');
    }
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }
}
