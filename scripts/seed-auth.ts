import "dotenv/config";

import { hash } from "bcryptjs";

import { prisma } from "../src/lib/db";

/**
 * Seed minimal untuk M1 (Fase B): hanya akun agar login dapat diuji.
 * Dataset dashboard penuh dibuat oleh `npm run seed` di M3.
 */

const DEMO_PASSWORD = "Segmenta123!";

const ACCOUNTS = [
  { email: "admin@segmenta.test", name: "Admin Segmenta", role: "ADMIN" as const },
  { email: "customer@segmenta.test", name: "Pelanggan Demo", role: "CUSTOMER" as const },
  { email: "budi@segmenta.test", name: "Budi Santoso", role: "CUSTOMER" as const },
];

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 10);

  for (const account of ACCOUNTS) {
    await prisma.user.upsert({
      where: { email: account.email },
      create: {
        email: account.email,
        name: account.name,
        role: account.role,
        passwordHash,
      },
      update: {
        name: account.name,
        role: account.role,
        passwordHash,
      },
    });
  }

  console.log(`Seeded ${ACCOUNTS.length} accounts (password: ${DEMO_PASSWORD})`);

  for (const account of ACCOUNTS) {
    console.log(`- ${account.email} (${account.role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
