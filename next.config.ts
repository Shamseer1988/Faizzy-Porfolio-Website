import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Allow YouTube thumbnails and the R2 media bucket (its public custom
    // domain / r2.dev subdomain) as remote image sources.
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "media.faizzyworld.com" },
      ...(process.env.R2_PUBLIC_HOSTNAME
        ? [{ protocol: "https" as const, hostname: process.env.R2_PUBLIC_HOSTNAME }]
        : []),
    ],
  },
  // Exclude Node.js-only packages from the server bundle — they are only used
  // during local development and are dynamically imported with try/catch in
  // src/lib/db.ts, so their absence at runtime on Cloudflare is safe.
  serverExternalPackages: [
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
  ],
  // Enable WebAssembly support for Prisma's workerd query compiler.
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;

// Enables Cloudflare bindings (D1, R2, …) during `next dev` via OpenNext.
// initOpenNextCloudflareForDev()'s own internal guard only dedupes between
// Next dev's two worker processes — it does NOT distinguish `next dev` from
// `next build`. Without this NODE_ENV check, a production build can trip
// that heuristic and try to open a live connection to any `"remote": true`
// binding in wrangler.jsonc, which hangs/fails the build (or, worse, can
// wire the bundled Worker to a dev-only proxy instead of plain production
// bindings). Only ever run it for the actual dev server.
if (process.env.NODE_ENV === "development") {
  void initOpenNextCloudflareForDev();
}
