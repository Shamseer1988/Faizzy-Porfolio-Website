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
// No-ops outside local development.
void initOpenNextCloudflareForDev();
