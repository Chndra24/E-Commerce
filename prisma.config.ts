import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma Migrate must use the session pooler (port 5432). The application
    // runtime uses the transaction pooler through DATABASE_URL (src/lib/db.ts).
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
