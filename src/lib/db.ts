import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi connection string Supabase.",
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Satu instance PrismaClient per proses. Saat dev, instance disimpan di globalThis
 * agar hot reload tidak membuka koneksi baru terus-menerus.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
