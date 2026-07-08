import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { defaultContent } from "../src/lib/defaults";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const c = defaultContent;
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...c.profile },
  });

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: c.skills.map(({ name, percent, order }) => ({ name, percent, order })),
    });
  }
  if ((await prisma.hobby.count()) === 0) {
    await prisma.hobby.createMany({
      data: c.hobbies.map(({ label, order }) => ({ label, order })),
    });
  }
  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: c.projects.map(({ id: _id, ...p }) => p),
    });
  }
  if ((await prisma.familyMember.count()) === 0) {
    await prisma.familyMember.createMany({
      data: c.family.map(({ id: _id, ...f }) => f),
    });
  }
  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({
      data: c.gallery.map(({ id: _id, ...g }) => g),
    });
  }
  if ((await prisma.milestone.count()) === 0) {
    await prisma.milestone.createMany({
      data: c.milestones.map(({ id: _id, ...m }) => m),
    });
  }
  console.log("Seed complete ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
