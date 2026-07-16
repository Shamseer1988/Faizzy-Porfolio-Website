import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext Cloudflare adapter configuration. Defaults are fine for this app;
// caching uses the Worker's in-memory/incremental cache. See
// https://opennext.js.org/cloudflare for advanced options (R2 incremental
// cache, KV, Durable Object queues, etc.).
export default defineCloudflareConfig();
