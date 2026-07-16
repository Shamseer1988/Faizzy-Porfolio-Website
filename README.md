# Zohan Faizzy — Young Maker Portfolio 🤖⚽

A 3D-animated, glassmorphism portfolio website for **Muhammed Zohan Faizzy**, built with
Next.js (App Router), TypeScript, Tailwind CSS and SQLite. It deploys to **Cloudflare
Workers** with **D1** (database) and **R2** (media storage).

## Features

- 🎨 **3D glassmorphism design** — mouse-tilt hero card, floating badges, scroll-reveal
  animations, animated skill bars, marquee ticker
- 🌗 **Dark / light mode** — follows the system theme, with a manual toggle that remembers
  the choice
- 🕐 **Live date & time** — ticking clock in the navbar and About section
- 🎬 **Faizzy World** — YouTube channel section with AI-video "rendering" animation
- 🔐 **Admin panel** (`/admin`) — login-protected dashboard to edit profile, skills,
  hobbies, projects, family, gallery, videos and read contact messages, with
  **direct-to-R2 image/video uploads**
- 📄 **Resume** — live-data resume page at `/resume` with print/save-as-PDF
- 📬 **Contact form** — messages land in the admin inbox
- 🔍 **SEO** — Open Graph tags, sitemap, robots.txt
- 🪂 **Graceful fallback** — without a database the public site still renders full
  built-in content (admin + contact need the DB)

## Quick start (local)

```bash
npm install
cp .env.example .env          # defaults are fine for local dev
npm run db:setup              # creates + seeds the local SQLite file (prisma/dev.db)
npm run dev                   # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` — credentials come from
`ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`.

## Deployment → Cloudflare (faizzyworld.com)

The site runs on **Cloudflare Workers** (via OpenNext) with **D1** for the
database and **R2** for uploaded media. Full step-by-step instructions:

**→ [docs/DEPLOYMENT_CLOUDFLARE.md](docs/DEPLOYMENT_CLOUDFLARE.md)**

Once set up, deploying is a single command:

```bash
npm run deploy
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Local SQLite file (`file:./prisma/dev.db`). Ignored in production — Cloudflare uses the D1 binding. |
| `AUTH_SECRET` | Secret for signing admin session tokens |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel login |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO metadata |
| `R2_PUBLIC_URL` / `R2_PUBLIC_HOSTNAME` | Public base URL of the R2 media bucket |

## Project structure

```
prisma/            schema + seed (Zohan's content)
public/images/     edited photos (hero, family, gallery, OG image)
src/app/           pages: home, resume, admin/*, api/contact
src/components/    Nav, TiltCard, LiveClock, RoleRotator, ContactForm, …
src/lib/           db client, content loader with fallback, auth (JWT sessions)
```
