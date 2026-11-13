import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  // منع تجميع الحزم الأصلية (native) الخاصة بـ Prisma/SQLite داخل الـ bundle
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
  ],
};

export default nextConfig;
