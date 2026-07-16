import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Local SQLite file for `prisma db push` / `prisma migrate` during
    // development. Production uses Cloudflare D1 (see the deployment docs).
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
