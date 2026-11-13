import "server-only";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// استخدم Turso عند وجود متغيرَيها، وإلا استمر على SQLite المحلية للتطوير.
function makeClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (Boolean(tursoUrl) !== Boolean(tursoAuthToken)) {
    throw new Error("يجب ضبط TURSO_DATABASE_URL وTURSO_AUTH_TOKEN معًا.");
  }

  const adapter = tursoUrl && tursoAuthToken
    ? new PrismaLibSql({ url: tursoUrl, authToken: tursoAuthToken })
    : new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL ?? "file:./dev.db",
      });

  return new PrismaClient({
    adapter,
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
