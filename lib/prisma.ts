import "server-only";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// التطبيق يتصل بقاعدة Turso فقط. لا نرجع إلى قاعدة محلية بصمت عند غياب الإعدادات.
function makeClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!tursoUrl || !tursoAuthToken) {
    throw new Error(
      "قاعدة البيانات غير مهيأة. اضبط TURSO_DATABASE_URL وTURSO_AUTH_TOKEN.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaLibSql({ url: tursoUrl, authToken: tursoAuthToken }),
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
