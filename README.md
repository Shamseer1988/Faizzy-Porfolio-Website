# Zohan Faizzy — Young Maker Portfolio 🤖⚽

A 3D-animated, glassmorphism portfolio website for **Muhammed Zohan Faizzy**, built with
Next.js (App Router), TypeScript, Tailwind CSS and PostgreSQL.

## Features

- 🎨 **3D glassmorphism design** — mouse-tilt hero card, floating badges, scroll-reveal
  animations, animated skill bars, marquee ticker
- 🌗 **Dark / light mode** — follows the system theme, with a manual toggle that remembers
  the choice
- 🕐 **Live date & time** — ticking clock in the navbar and About section
- 🎬 **Faizzy World** — YouTube channel section with AI-video "rendering" animation
- 🔐 **Admin panel** (`/admin`) — login-protected dashboard to edit profile, skills,
  hobbies, projects, family, gallery captions and read contact messages, all stored in
  PostgreSQL
- 📄 **Resume** — live-data resume page at `/resume` with print/save-as-PDF
- 📬 **Contact form** — messages land in the admin inbox
- 🔍 **SEO** — Open Graph tags, sitemap, robots.txt
- 🪂 **Graceful fallback** — without a database the public site still renders full
  built-in content (admin + contact need the DB)

## Quick start (local)

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL, AUTH_SECRET, admin credentials
npm run db:setup              # creates tables and seeds Zohan's content
npm run dev                   # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` — credentials come from
`ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`.

## Deployment

### VPS (Docker — recommended)

```bash
AUTH_SECRET=$(openssl rand -base64 32) ADMIN_PASSWORD=your-password docker compose up -d --build
```

This starts PostgreSQL + the site on port 3000, pushes the schema and seeds it on first
run. Put nginx/Caddy in front for HTTPS.

### Vercel + hosted Postgres

1. Import the repo on Vercel.
2. Add a Postgres database (Vercel Postgres / Neon / Supabase).
3. Set env vars: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
   `NEXT_PUBLIC_SITE_URL`.
4. Run `npm run db:setup` once against the production `DATABASE_URL` (e.g. locally).

### GitHub Pages (static, no admin)

GitHub Pages only serves static files — it cannot run the admin panel, the contact-form
API or PostgreSQL. The public site content still works because of the built-in fallback
data. If you want a static copy, deploy the same repo to Vercel free tier instead — it
keeps every feature. (For a pure static export you would need to remove the API route
and admin pages and run `next build` with `output: "export"`.)

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (optional — fallback content without it) |
| `AUTH_SECRET` | Secret for signing admin session tokens |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel login |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO metadata |

## Project structure

```
prisma/            schema + seed (Zohan's content)
public/images/     edited photos (hero, family, gallery, OG image)
src/app/           pages: home, resume, admin/*, api/contact
src/components/    Nav, TiltCard, LiveClock, RoleRotator, ContactForm, …
src/lib/           db client, content loader with fallback, auth (JWT sessions)
```
