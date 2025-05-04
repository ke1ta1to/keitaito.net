import type { Prisma } from "@/generated/prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const crossLinkData: Prisma.CrossLinkCreateInput[] = [
  {
    title: "CrossLink 1",
    description: "Description for CrossLink 1",
    url: "https://example.com/crosslink1",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=640&h=480&auto=format&fit=crop",
  },
  {
    title: "CrossLink 2",
    description: "Description for CrossLink 2",
    url: "https://example.com/crosslink2",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=640&h=480&auto=format&fit=crop",
  },
];

export async function main() {
  for (const c of crossLinkData) {
    await prisma.crossLink.create({
      data: c,
    });
  }
}

main();
