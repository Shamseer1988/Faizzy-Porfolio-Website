import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { defaultContent } from "../src/lib/defaults";

// Seeds the local SQLite database (DATABASE_URL="file:./prisma/dev.db").
// For the Cloudflare D1 production database, seed with wrangler instead —
// see docs/DEPLOYMENT_CLOUDFLARE.md.
const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const c = defaultContent;

  // SQLite has no array type — store string[] fields as JSON strings.
  const profile = { ...c.profile, roles: JSON.stringify(c.profile.roles) };
  await prisma.profile.upsert({
    where: { id: 1 },
    update: profile,
    create: { id: 1, ...profile },
  });

  // Clean existing tables to avoid duplicate entries and force a reset.
  await prisma.skill.deleteMany();
  await prisma.hobby.deleteMany();
  await prisma.project.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.video.deleteMany();

  await prisma.skill.createMany({
    data: c.skills.map(({ name, percent, order }) => ({ name, percent, order })),
  });
  await prisma.hobby.createMany({
    data: c.hobbies.map(({ label, order }) => ({ label, order })),
  });
  await prisma.project.createMany({
    data: c.projects.map(({ id: _id, tools, ...p }) => ({
      ...p,
      tools: JSON.stringify(tools),
    })),
  });
  await prisma.familyMember.createMany({
    data: c.family.map(({ id: _id, ...f }) => f),
  });
  await prisma.galleryItem.createMany({
    data: c.gallery.map(({ id: _id, ...g }) => g),
  });
  await prisma.milestone.createMany({
    data: c.milestones.map(({ id: _id, ...m }) => m),
  });
  await prisma.video.createMany({
    data: c.videos.map(({ id: _id, ...v }) => v),
  });
  console.log("Seed complete ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
