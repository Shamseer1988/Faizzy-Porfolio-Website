import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Fallback keeps `prisma generate` working when no database is configured.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder",
  },
});
