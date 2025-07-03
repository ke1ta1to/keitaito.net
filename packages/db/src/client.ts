import { PrismaClient } from "../generated/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Export Prisma types for convenience
export { PrismaClient, Prisma } from "../generated/client";
