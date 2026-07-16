import type { R2Bucket } from "@cloudflare/workers-types";

// Resolves the R2 bucket binding (MEDIA) from the Cloudflare Worker context.
// Returns null when not running on Cloudflare (e.g. plain `next dev` without
// wrangler), so callers can respond gracefully instead of crashing.
export async function getMediaBucket(): Promise<R2Bucket | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    return (env as { MEDIA?: R2Bucket }).MEDIA ?? null;
  } catch {
    return null;
  }
}

// Public base URL where the R2 bucket is served (a custom domain like
// https://media.faizzyworld.com, or the bucket's r2.dev subdomain).
export function mediaPublicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");
  return base ? `${base}/${key}` : `/${key}`;
}

// Builds a safe, collision-resistant object key from an upload filename.
export function makeMediaKey(filename: string): string {
  const clean = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `uploads/${stamp}-${rand}-${clean || "file"}`;
}
