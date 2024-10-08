import { PrismaClient } from "@prisma/client";

declare const global: {
  prisma: PrismaClient | undefined;
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.PRISMA_DEBUG
      ? ["query", "info", "warn", "error"]
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
