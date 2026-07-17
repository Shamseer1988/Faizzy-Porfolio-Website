# Deploying to Cloudflare (faizzyworld.com)

This site runs on **Cloudflare Workers** (via the [OpenNext](https://opennext.js.org/cloudflare)
adapter for Next.js), with:

- **Cloudflare D1** — the SQLite database (profile, projects, videos, timeline, messages …)
- **Cloudflare R2** — object storage for uploaded images / videos
- **faizzyworld.com** — your domain, already on Cloudflare

> **Windows users — read this first.** Building the Worker locally on Windows
> requires **Windows Developer Mode** to be enabled (to avoid `symlink` permission errors).
> We have included a custom path-fix script (`scripts/fix-wasm-paths.mjs`) that runs
> automatically during builds to fix mangled paths. You can deploy directly from your
> Windows laptop using `npm run deploy`, or use **[Part C — GitHub → Cloudflare auto-deploy](#part-c--deploy-from-github-auto-deploy-recommended)**.

---

## How it fits together

| Piece            | Local development                         | Production (Cloudflare)             |
| ---------------- | ----------------------------------------- | ----------------------------------- |
| Database         | SQLite file **or** local D1 emulator      | D1 binding `DB`                     |
| Database Driver  | `better-sqlite3`                          | D1 Database Binding                 |
| Media storage    | local R2 emulator                         | R2 binding `MEDIA`                  |
| Deploy           | `npm run deploy` (requires Developer Mode)| Cloudflare builds from GitHub       |

`src/lib/db.ts` contains a lightweight custom database wrapper that mimics the required Prisma CRUD client. It resolves the database automatically: a `file:` `DATABASE_URL` uses a local SQLite file (via `better-sqlite3`); otherwise it uses the D1 binding. This completely removes the heavy Prisma Client engine and its WASM query compiler from the production Worker, keeping your gzipped bundle under the Cloudflare Workers Free limit (3 MiB). If neither database is reachable, the site still renders using the built-in `defaultContent` (**graceful fallback**).

---

## Prerequisites

- Node.js 20+
- The repo cloned locally (e.g. `D:\Dev Projects\Personal Projects\Faizzy-Porfolio-Website`)
- A Cloudflare account with **faizzyworld.com** already added
- A GitHub account connected to that repo
- Wrangler is bundled — use it through `npx`

Log in to Cloudflare once (opens a browser):

```bash
npx wrangler login
```

Install dependencies:

```bash
npm install
```

`postinstall` runs `prisma generate`, creating both Prisma clients under
`src/generated/` (git-ignored — regenerated automatically everywhere).

---

## Part A — Create D1 and R2 (fresh)

### A1. Create the D1 database

```bash
npx wrangler d1 create faizzyworld-db
```

Copy the `database_id` it prints. Open **`wrangler.jsonc`** and paste it in,
replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "faizzyworld-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "migrations_dir": "migrations"
  }
]
```

> ⚠️ **This must be committed to GitHub** — Cloudflare's auto-build reads
> `wrangler.jsonc` from your repo. If the id stays as the placeholder, the
> deploy will fail. Commit + push after editing (see step A4).

Create the tables and load the starter content on the **remote** database:

```bash
npm run d1:migrate:remote     # applies migrations/0001_init.sql
npm run d1:seed:remote        # loads prisma/seed-d1.sql (default content)
```

These are plain API calls — they work fine on Windows (no build involved).

### A2. Create the R2 bucket

```bash
npx wrangler r2 bucket create faizzyworld-media
```

### A3. Give R2 a public URL

Uploaded images/videos need a public URL to be viewable. In the Cloudflare
dashboard → **R2 → faizzyworld-media → Settings → Public access**, choose one:

- **Custom domain (recommended):** connect `media.faizzyworld.com`
  (Cloudflare adds the DNS record for you), **or**
- **r2.dev subdomain:** enable the managed `https://<hash>.r2.dev` URL.

Put that URL in **`wrangler.jsonc`** → `vars` (pre-filled for the custom
domain — change if you used r2.dev):

```jsonc
"vars": {
  "NEXT_PUBLIC_SITE_URL": "https://faizzyworld.com",
  "R2_PUBLIC_URL": "https://media.faizzyworld.com",
  "R2_PUBLIC_HOSTNAME": "media.faizzyworld.com"
}
```

- `R2_PUBLIC_URL` — the base an upload's URL is built from
- `R2_PUBLIC_HOSTNAME` — same host without the scheme (lets `next/image` optimise it)

### A4. Commit the config

```bash
git add wrangler.jsonc
git commit -m "Configure D1 database id and R2 public URL"
git push
```

---

## Part B — Set secrets

The admin login and session signing use secrets (never commit these):

```bash
npx wrangler secret put AUTH_SECRET        # a long random string: openssl rand -base64 32
npx wrangler secret put ADMIN_USERNAME     # your admin username
npx wrangler secret put ADMIN_PASSWORD     # your admin password
```

If wrangler says *"no Worker found — create one? (y/N)"*, answer **Y** — it
creates the `faizzyworld` Worker so the secrets have somewhere to live. The
first real code deploy (Part C) then fills that Worker with the site.

> You can also set these later in the dashboard: **Workers → faizzyworld →
> Settings → Variables and Secrets → Add**.

---

## Part C — Deploy from GitHub (auto-deploy, recommended)

This builds on Cloudflare's Linux servers, so the Windows symlink error can't
happen, and it **redeploys automatically on every push** to your branch.

1. Cloudflare dashboard → **Workers & Pages → faizzyworld → Settings →
   Build → Connect** (or **Workers & Pages → Create → Import a repository**).
2. Authorise GitHub and pick your repo (`Shamseer1988/faizzy-porfolio-website`)
   and the **`master`** branch.
3. Set the build configuration:
   - **Build command:** `npm run build:cf`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/` (leave default)
4. Save. Cloudflare runs `npm install` → builds the Worker with OpenNext →
   deploys it. Watch the build log; when it finishes, open the
   `https://faizzyworld.<your-subdomain>.workers.dev` URL it prints.

From now on, **every `git push` to `master` triggers a fresh build + deploy**
automatically. No local build needed, ever.

> Bindings (D1 `DB`, R2 `MEDIA`) and `vars` come from `wrangler.jsonc`, so
> they're applied on every deploy. Secrets (Part B) persist on the Worker
> across deploys.

### (Optional) One-off manual deploy

You can deploy straight from your machine:

```bash
npm run deploy
```

> ⚠️ **Windows Users:** To run a manual deploy, ensure **Windows Developer Mode** is enabled (Go to **Windows Settings → System → For developers** and switch Developer Mode to **ON**) so that the build step can successfully create symlinks.

---

## Part D — Point faizzyworld.com at the Worker

Cloudflare dashboard → **Workers & Pages → faizzyworld → Settings → Domains &
Routes → Add → Custom Domain**:

- `faizzyworld.com`
- optionally `www.faizzyworld.com`

Cloudflare provisions TLS automatically. Within a minute or two,
**https://faizzyworld.com** serves the site.

---

## Part E — Local development & testing

You do **not** need Cloudflare to work on the site. Pick the mode you want:

### Mode 1 — Quick UI work (local SQLite) — simplest

```bash
# .env → DATABASE_URL="file:./prisma/dev.db"
npm run db:setup      # creates + seeds prisma/dev.db (first time only)
npm run dev           # http://localhost:3000
```

Everything works except R2 uploads (those need the Cloudflare runtime). Great
for design/content changes.

### Mode 2 — Full local: D1 **and** R2, emulated — recommended for testing

This runs the real Cloudflare bindings locally through the OpenNext dev shim,
so the admin panel, database **and** R2 uploads all work — no cloud account
touched, fully offline.

```bash
# 1. In .env, leave DATABASE_URL EMPTY:
#    DATABASE_URL=""
# 2. Create + seed the local D1 emulator (first time only):
npm run d1:setup:local
# 3. Run it:
npm run dev           # http://localhost:3000
```

Now `/admin` edits save to the local D1, and **⬆ Upload** stores files in the
local R2 emulator (under `.wrangler/`). Uploaded files live locally, so their
preview only renders if `R2_PUBLIC_URL` points at a reachable bucket — for
viewing real uploads, use Mode 3 or just check them on the deployed site.

If the local D1 isn't set up, the site falls back to the built-in content
(read-only) — it never crashes.

### Mode 3 — Local against the **real** cloud D1 + R2 (remote bindings)

Use this when you want local testing to hit your actual Cloudflare D1 database
and R2 bucket (so uploads land in the real bucket and are viewable). Requires
`npx wrangler login` and the resources from Part A.

Add `"remote": true` to the D1 and R2 bindings in **`wrangler.jsonc`** (or keep
a copy in a git-ignored `wrangler.dev.jsonc`):

```jsonc
"d1_databases": [{ "binding": "DB", "database_name": "faizzyworld-db", "database_id": "…", "remote": true }],
"r2_buckets":  [{ "binding": "MEDIA", "bucket_name": "faizzyworld-media", "remote": true }]
```

Then with `DATABASE_URL=""` in `.env`, run `npm run dev`. Bindings now proxy to
the real cloud resources. **Remove `"remote": true` before committing** (or
production would also try remote-proxy) — production uses the direct bindings.

### Switching modes

The only toggle is `DATABASE_URL` in `.env`:

| `DATABASE_URL`             | Database used                                   |
| ------------------------- | ----------------------------------------------- |
| `file:./prisma/dev.db`    | local SQLite file (Mode 1)                      |
| `` (empty)                | the D1 binding — local emulator or remote (2/3) |

---

## Editing content (after deploy)

Log in at **https://faizzyworld.com/admin/login** with your admin credentials.
Everything (profile, skills, projects, timeline, family, gallery, videos,
messages) is editable and goes live immediately. On the Gallery, Videos and
Timeline forms, **⬆ Upload** sends an image/video straight to R2 and saves its
URL for you.

---

## Changing the database schema

1. Edit `prisma/schema.prisma`.
2. Regenerate the migration SQL: `npm run db:migrations`.
3. Apply it:
   ```bash
   npm run d1:migrate:local     # local emulator
   npm run d1:migrate:remote    # production D1
   ```
4. For the SQLite file mode, `npm run db:push` updates `prisma/dev.db`.

> SQLite has no array type, so `string[]` fields (profile roles, project tools)
> are stored as JSON strings and parsed in `src/lib/serialize.ts`.

---

## Troubleshooting

- **`EPERM: operation not permitted, symlink …`** — you ran `npm run deploy` or `npm run build:cf` on **Windows** without having Windows Developer Mode enabled. To fix, turn Developer Mode **ON** under **Windows Settings → System → For developers**.
- **Cloudflare build fails on `database_id`** — the placeholder is still in `wrangler.jsonc`. Put your real D1 id there, commit, and push.
- **Admin edits don't save in production** — check the `AUTH_SECRET` / `ADMIN_USERNAME` / `ADMIN_PASSWORD` secrets are set, and that migrations ran on the **remote** D1 (`npm run d1:migrate:remote`).
- **Uploaded images 404** — the R2 bucket needs public access and `R2_PUBLIC_URL` must match that public URL.
- **Homepage shows default content, not your edits** — the Worker couldn't reach D1 (binding/migration issue); it fell back to built-in content so the site stays up. Fix the D1 binding/migrations and redeploy (push to GitHub).
- **`WebAssembly.Module(): Wasm code generation disallowed`** or **Worker size limits exceeded** — these are historically caused by Prisma's WASM engine. We migrated the database client to a direct, lightweight SQL query interface (`src/lib/db.ts`), which completely bypasses Prisma at runtime on Cloudflare, keeping the build size down to ~1.5 MB gzipped and avoiding WASM compilation errors.
- **"Worker threw exception" (Error 1101) on every request, dashboard shows 0 bindings** — caused by a bug in `next.config.ts`: `initOpenNextCloudflareForDev()` is meant to run only for `next dev`, but its own internal guard only dedupes between Next dev's two worker processes — it does **not** distinguish `next dev` from `next build`. If it runs during a production build while `wrangler.jsonc` has any `"remote": true` binding (used for [local testing against real cloud resources](#mode-3--local-against-the-real-cloud-d1--r2-remote-bindings)), it can hang the build waiting on live Cloudflare auth, or wire the bundled Worker to a dev-only proxy instead of plain production bindings — which then throws on every real request. **Fix:** `next.config.ts` must gate the call behind `if (process.env.NODE_ENV === "development")` so it never runs during `next build`. This is already fixed in this repo — if you see this again, confirm that guard is still in place. After pulling the fix, do a **fresh production build and redeploy** (`rm -rf .open-next && npm run deploy`, or push to `master` and let the GitHub build run) — the earlier deployed Worker version is still broken until you deploy a build made with the fix.
- **Live logs:** `npx wrangler tail`.
