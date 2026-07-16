import type { PrismaClient } from "@/generated/prisma/client";
import type { D1Database } from "@cloudflare/workers-types";

// The app talks to SQLite through a Prisma driver adapter. Both the client
// build and the adapter depend on where the code is running:
//
//   • Cloudflare Workers (production)  → workerd Prisma client + D1 binding `DB`
//   • Local dev / build / CI           → Node Prisma client + a SQLite file
//     (DATABASE_URL="file:./prisma/dev.db")
//
// getDb() resolves the right client lazily and caches it. When no database is
// available it returns null, and callers fall back to the built-in
// defaultContent so the site still renders.

let localClient: PrismaClient | undefined;
let d1Client: PrismaClient | undefined;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export async function getDb(): Promise<PrismaClient | null> {
  // A local SQLite file always wins when explicitly configured — this keeps
  // `next dev`, `next build` and CI on a plain file with no Cloudflare runtime.
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    if (!localClient) {
      try {
        const [{ PrismaClient }, { PrismaBetterSqlite3 }] = await Promise.all([
          import("@/generated/prisma/client"),
          import("@prisma/adapter-better-sqlite3"),
        ]);
        localClient =
          globalForPrisma.prisma ??
          (new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) }) as PrismaClient);
        if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = localClient;
      } catch {
        return null;
      }
    }
    return localClient;
  }

  // On Cloudflare, use the workerd-targeted client with the D1 binding.
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const binding = (env as { DB?: D1Database }).DB;
    if (binding) {
      if (!d1Client) {
        const [{ PrismaClient }, { PrismaD1 }] = await Promise.all([
          import("@/generated/prisma-workerd/client"),
          import("@prisma/adapter-d1"),
        ]);
        d1Client = new PrismaClient({ adapter: new PrismaD1(binding) }) as unknown as PrismaClient;
      }
      return d1Client;
    }
  } catch {
    // Not running inside a Cloudflare context — no database available.
  }

  return null;
}
