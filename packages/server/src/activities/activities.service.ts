import { Injectable } from '@nestjs/common';

import { Prisma } from '@/generated/prisma';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  create(params: { data: Prisma.ActivityCreateInput }) {
    const { data } = params;
    return this.prisma.activity.create({ data });
  }

  findAll() {
    return this.prisma.activity.findMany();
  }

  findOne(params: { id: number }) {
    const { id } = params;
    return this.prisma.activity.findUniqueOrThrow({
      where: { id },
    });
  }

  update(params: { id: number; data: Prisma.ActivityUpdateInput }) {
    const { id, data } = params;
    return this.prisma.activity.update({ where: { id }, data });
  }

  remove(params: { id: number }) {
    const { id } = params;
    return this.prisma.activity.delete({ where: { id } });
  }
}
