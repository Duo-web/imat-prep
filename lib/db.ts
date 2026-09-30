/**
 * lib/db.ts
 * Prisma client singleton — safe for use in Next.js dev (hot reload)
 * and production (no query logging).
 *
 * - Development: logs queries + errors to the console
 * - Production:  logs only errors (no query noise, better performance)
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

// Prevent multiple instances during Next.js hot reload in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
