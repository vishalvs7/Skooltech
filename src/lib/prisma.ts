import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

/**
 * Returns true if DATABASE_URL is configured and Prisma can connect.
 * Use this in pages to show a friendly setup message instead of crashing.
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
