# Deploying to Cloudflare (faizzyworld.com)

This site runs on **Cloudflare Workers** (via the [OpenNext](https://opennext.js.org/cloudflare)
adapter for Next.js), with:

- **Cloudflare D1** — the SQLite database (profile, projects, videos, timeline, messages …)
- **Cloudflare R2** — object storage for uploaded images / videos
- **faizzyworld.com** — your domain, already on Cloudflare

Everything below is a one-time setup; after that you deploy with a single
`npm run deploy`.

---

## How it fits together

| Piece            | Local development                         | Production (Cloudflare)             |
| ---------------- | ----------------------------------------- | ----------------------------------- |
| Database         | SQLite file `prisma/dev.db`               | D1 binding `DB`                     |
| Prisma client    | `src/generated/prisma` (Node)             | `src/generated/prisma-workerd`      |
| Media storage    | local R2 emulator (via `npm run preview`) | R2 binding `MEDIA`                  |
| Admin auth guard | admin layout (`isAuthenticated()`)        | same (no Node middleware)           |

`src/lib/db.ts` picks the right database automatically: a `file:` `DATABASE_URL`
uses the local SQLite file; otherwise it uses the D1 binding. If neither is
present the site still renders using the built-in `defaultContent`.

---

## Prerequisites

- Node.js 20+
- A Cloudflare account with **faizzyworld.com** already added
- Wrangler (bundled — used through `npx`)

Log in once:

```bash
npx wrangler login
```

---

## 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate`, which creates both Prisma clients
(Node + workerd) under `src/generated/` (git-ignored).

---

## 2. Create the D1 database

```bash
npx wrangler d1 create faizzyworld-db
```

Copy the `database_id` it prints and paste it into **`wrangler.jsonc`**,
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

Create the tables on the remote database, then load the starter content:

```bash
npm run d1:migrate:remote     # applies migrations/0001_init.sql to D1
npm run d1:seed:remote        # loads prisma/seed-d1.sql (default content)
```

> The schema lives in `prisma/schema.prisma`. `migrations/0001_init.sql`
> was generated from it with `npm run db:migrations`. `prisma/seed-d1.sql`
> is the default content as SQL.

---

## 3. Create the R2 bucket (media storage)

```bash
npx wrangler r2 bucket create faizzyworld-media
```

Give the bucket a **public URL** so uploaded images/videos are viewable.
In the Cloudflare dashboard → **R2 → faizzyworld-media → Settings → Public
access**, either:

- **Custom domain (recommended):** connect `media.faizzyworld.com`, or
- **r2.dev subdomain:** enable the managed `https://<hash>.r2.dev` URL.

Then set that URL in **`wrangler.jsonc`** (already pre-filled for a custom
domain — adjust if you used r2.dev):

```jsonc
"vars": {
  "NEXT_PUBLIC_SITE_URL": "https://faizzyworld.com",
  "R2_PUBLIC_URL": "https://media.faizzyworld.com",
  "R2_PUBLIC_HOSTNAME": "media.faizzyworld.com"
}
```

`R2_PUBLIC_URL` is the base an upload's URL is built from; `R2_PUBLIC_HOSTNAME`
lets `next/image` optimise those images.

---

## 4. Set secrets

Never commit these — set them as Worker secrets:

```bash
# strong random value: openssl rand -base64 32
npx wrangler secret put AUTH_SECRET
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
```

`ADMIN_USERNAME` / `ADMIN_PASSWORD` are the credentials for `/admin/login`.

---

## 5. Deploy

```bash
npm run deploy
```

This regenerates the Prisma clients, builds the Worker with OpenNext, and
deploys it. Wrangler prints the `*.workers.dev` URL — open it to confirm the
site works.

---

## 6. Point faizzyworld.com at the Worker

In the Cloudflare dashboard → **Workers & Pages → faizzyworld → Settings →
Domains & Routes → Add → Custom Domain**, add:

- `faizzyworld.com`
- `www.faizzyworld.com` (optional; or redirect www → apex)

Cloudflare provisions the TLS certificate automatically. Within a minute or
two, https://faizzyworld.com serves the Worker.

You can also do this from the CLI by adding a `routes` block to
`wrangler.jsonc`, but the dashboard Custom Domain flow is simplest for an
apex domain already on Cloudflare.

---

## Day-to-day: editing content

Log in at **https://faizzyworld.com/admin/login** with your admin
credentials. Everything on the site (profile, skills, projects, timeline,
family, gallery, videos, messages) is editable there, and changes go live
immediately.

**Uploading media:** on the Gallery, Videos and Timeline forms, click
**⬆ Upload** to send an image/video straight to R2 — the public URL is
filled in and saved for you. You can also paste an existing URL by hand.

---

## Local development

Two ways to run locally:

### a) Fast UI work — `next dev` on SQLite

```bash
npm run db:setup     # creates + seeds prisma/dev.db (first time only)
npm run dev          # http://localhost:3000
```

Uses the local SQLite file. The admin panel and contact form work; uploads
show a "not available" message (R2 needs the Worker runtime — see below).

### b) Production-like — the real Worker on local D1 + R2

```bash
# one-time: create the local D1 tables + data
npx wrangler d1 migrations apply faizzyworld-db --local
npx wrangler d1 execute faizzyworld-db --local --file=./prisma/seed-d1.sql

npm run preview      # builds the Worker and runs it in workerd (miniflare)
```

This mirrors production exactly, including D1 and R2 (uploads work against a
local R2 emulator). To make `preview` use local D1 instead of the SQLite
file, create a **`.dev.vars`** file (git-ignored) with:

```
DATABASE_URL=""
```

---

## Changing the database schema

1. Edit `prisma/schema.prisma`.
2. Regenerate the init migration (or add a new numbered file under
   `migrations/`):
   ```bash
   npm run db:migrations
   ```
3. Apply locally and remotely:
   ```bash
   npx wrangler d1 migrations apply faizzyworld-db --local
   npm run d1:migrate:remote
   ```
4. `npm run db:push` updates your local SQLite file for `next dev`.

> SQLite has no array type, so `string[]` fields (profile roles, project
> tools) are stored as JSON strings and parsed in `src/lib/serialize.ts`.

---

## Troubleshooting

- **`WebAssembly.Module(): Wasm code generation disallowed`** — you're using
  the Node Prisma client on the Worker. Make sure the D1 path uses
  `src/generated/prisma-workerd` (it does by default in `src/lib/db.ts`).
- **Admin edits don't save on the Worker** — check `AUTH_SECRET`,
  `ADMIN_USERNAME`, `ADMIN_PASSWORD` secrets are set, and that D1 migrations
  ran on the **remote** database (`npm run d1:migrate:remote`).
- **Uploaded images 404** — the R2 bucket needs public access and
  `R2_PUBLIC_URL` must match that public URL.
- **Homepage shows default content instead of your edits** — the Worker
  couldn't reach D1 (binding/migration issue); it falls back to
  `defaultContent` so the site never goes down. Fix the D1 binding and
  redeploy.
- **View live logs:** `npx wrangler tail`.
