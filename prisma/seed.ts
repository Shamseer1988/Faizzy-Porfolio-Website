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
    update: { ...c.profile },
    create: { id: 1, ...c.profile },
  });

  // Clean existing tables to avoid duplicate entries and force reset
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
    data: c.projects.map(({ id: _id, ...p }) => p),
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
