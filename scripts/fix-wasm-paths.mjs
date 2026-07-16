/**
 * fix-wasm-paths.mjs
 *
 * Works around a Windows-specific bug in the OpenNext Cloudflare build where
 * absolute Windows paths get mangled into WASM filenames inside handler.mjs.
 *
 * The build produces correct WASM files at e.g.:
 *   .open-next/server-functions/default/.next/server/chunks/ssr/
 *     src_generated_prisma-workerd_internal_query_compiler_fast_bg_0athij3.wasm
 *
 * But the import() calls in handler.mjs reference a non-existent mangled name:
 *   "D:/Dev Projetcs/.../chunks/ssr/Dev ProjetcsPersonal Projects...src_generated_prisma-workerd_...wasm"
 *
 * This script:
 *  1. Scans handler.mjs for broken WASM import paths
 *  2. Resolves each to the correct relative path
 *  3. Rewrites handler.mjs with fixed imports
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(".");
const HANDLER = join(
  ROOT,
  ".open-next",
  "server-functions",
  "default",
  "handler.mjs"
);

if (!existsSync(HANDLER)) {
  console.log("⏭  handler.mjs not found — skipping WASM path fix.");
  process.exit(0);
}

let src = readFileSync(HANDLER, "utf8");

// Match all import("...wasm") with absolute Windows paths
const re = /import\("(D:\/[^"]*?\.wasm)"\)/g;
let match;
let count = 0;

while ((match = re.exec(src)) !== null) {
  const broken = match[1];

  // The correct filename is always the last segment that starts with "src_generated_"
  // Extract it by finding the real WASM filename embedded in the mangled path
  const wasmNameMatch = broken.match(/(src_generated_[^/\\]+\.wasm)$/);
  if (!wasmNameMatch) {
    // Try alternative: the real name is after the last known directory
    console.warn(`⚠  Could not extract WASM name from: ${broken}`);
    continue;
  }

  const realName = wasmNameMatch[1];

  // Determine which subdirectory contains this file (chunks/ or chunks/ssr/)
  const candidatePaths = [
    ".next/server/chunks/ssr/" + realName,
    ".next/server/chunks/" + realName,
  ];

  const serverFnBase = join(
    ROOT,
    ".open-next",
    "server-functions",
    "default"
  );

  let fixedRelative = null;
  for (const candidate of candidatePaths) {
    const fullPath = join(serverFnBase, candidate);
    if (existsSync(fullPath)) {
      // Use the path relative to handler.mjs (which is in the same dir as .next/)
      fixedRelative = "./" + candidate.replace(/\\/g, "/");
      break;
    }
  }

  if (!fixedRelative) {
    console.warn(`⚠  WASM file not found for: ${realName}`);
    continue;
  }

  src = src.replaceAll(`import("${broken}")`, `import("${fixedRelative}")`);
  count++;
}

if (count > 0) {
  writeFileSync(HANDLER, src, "utf8");
  console.log(`✅ Fixed ${count} broken WASM import path(s) in handler.mjs`);
} else {
  console.log("✅ No broken WASM paths found — handler.mjs is clean.");
}
