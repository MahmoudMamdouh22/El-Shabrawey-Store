import "server-only";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function makeClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // إذا كانت إعدادات Turso موجودة، استخدمها
  if (tursoUrl && tursoAuthToken) {
    return new PrismaClient({
      adapter: new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoAuthToken,
      }),
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // خلايا fallback إذا لم تكن إعدادات Turso موجودة - استخدم SQLite محلياً
  console.warn("Turso configuration not found, using local SQLite");

  return new PrismaClient({
    adapter: new PrismaLibSql({
      url: "file:./dev.db",
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton عشان ما نفتحش اتصالات كتير في وضع التطوير (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}