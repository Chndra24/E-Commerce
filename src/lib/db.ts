import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi connection string Supabase.",
    );
  }

  return connectionString;
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: getConnectionString() }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();

  // Saat dev, instance disimpan di globalThis agar hot reload tidak membuka
  // koneksi baru terus-menerus.
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Klien dibuat saat properti pertama diakses, bukan saat modul di-import.
 *
 * `next build` mengevaluasi modul route handler untuk mengumpulkan data
 * halaman. Kalau koneksi dan validasi env terjadi di top-level, build ikut
 * menuntut DATABASE_URL padahal build tidak pernah menyentuh database.
 * Validasi env tetap dijalankan, hanya saja saat query pertama (runtime).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);

    // Method seperti $transaction dan $disconnect butuh `this` = client asli.
    return typeof value === "function" ? value.bind(client) : value;
  },
});
