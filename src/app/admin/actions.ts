"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { checkCredentials, createSession, destroySession } from "@/lib/auth";

function str(form: FormData, key: string, fallback = ""): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : fallback;
}

function num(form: FormData, key: string, fallback = 0): number {
  const n = Number(str(form, key));
  return Number.isFinite(n) ? n : fallback;
}

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/resume");
}

/* ---------- auth ---------- */

export async function loginAction(formData: FormData) {
  const username = str(formData, "username");
  const password = str(formData, "password");
  if (!checkCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- profile ---------- */

export async function updateProfileAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const roles = str(formData, "roles")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  await prisma.profile.update({
    where: { id: 1 },
    data: {
      fullName: str(formData, "fullName"),
      displayFirst: str(formData, "displayFirst"),
      displayHighlight: str(formData, "displayHighlight"),
      displayLast: str(formData, "displayLast"),
      roles: JSON.stringify(roles),
      bio: str(formData, "bio"),
      age: num(formData, "age", 11),
      className: str(formData, "className"),
      school: str(formData, "school"),
      house: str(formData, "house"),
      youtubeUrl: str(formData, "youtubeUrl"),
      youtubeHandle: str(formData, "youtubeHandle"),
      statusTag: str(formData, "statusTag"),
      projectsCount: num(formData, "projectsCount", 0),
    },
  });
  refreshPublic();
  revalidatePath("/admin/profile");
}

/* ---------- skills & hobbies ---------- */

export async function saveSkillAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const data = {
    name: str(formData, "name"),
    percent: Math.min(100, Math.max(0, num(formData, "percent"))),
    order: num(formData, "order"),
  };
  if (!data.name) return;
  if (id) await prisma.skill.update({ where: { id }, data });
  else await prisma.skill.create({ data });
  refreshPublic();
  revalidatePath("/admin/skills");
}

export async function deleteSkillAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.skill.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/skills");
}

export async function saveHobbyAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const data = { label: str(formData, "label"), order: num(formData, "order") };
  if (!data.label) return;
  if (id) await prisma.hobby.update({ where: { id }, data });
  else await prisma.hobby.create({ data });
  refreshPublic();
  revalidatePath("/admin/skills");
}

export async function deleteHobbyAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.hobby.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/skills");
}

/* ---------- projects ---------- */

export async function saveProjectAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const tools = str(formData, "tools")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const data = {
    title: str(formData, "title"),
    description: str(formData, "description"),
    icon: str(formData, "icon", "💡"),
    tag: str(formData, "tag"),
    accent: str(formData, "accent", "cyan"),
    tools: JSON.stringify(tools),
    order: num(formData, "order"),
    visible: formData.get("visible") === "on",
  };
  if (!data.title) return;
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data });
  refreshPublic();
  revalidatePath("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.project.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/projects");
}

/* ---------- family & gallery ---------- */

export async function saveFamilyAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const data = {
    name: str(formData, "name"),
    relation: str(formData, "relation"),
    emoji: str(formData, "emoji", "🙂"),
    order: num(formData, "order"),
  };
  if (!data.name) return;
  if (id) await prisma.familyMember.update({ where: { id }, data });
  else await prisma.familyMember.create({ data });
  refreshPublic();
  revalidatePath("/admin/family");
}

export async function deleteFamilyAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.familyMember.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/family");
}

export async function saveGalleryAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const data = {
    src: str(formData, "src"),
    caption: str(formData, "caption"),
    category: str(formData, "category", "life"),
    year: str(formData, "year", "2024"),
    order: num(formData, "order"),
  };
  if (!data.src) return;
  if (id) await prisma.galleryItem.update({ where: { id }, data });
  else await prisma.galleryItem.create({ data });
  refreshPublic();
  revalidatePath("/admin/family");
}

export async function deleteGalleryAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.galleryItem.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/family");
}

/* ---------- timeline milestones ---------- */

export async function saveMilestoneAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const image = str(formData, "image");
  const data = {
    year: str(formData, "year"),
    title: str(formData, "title"),
    story: str(formData, "story"),
    icon: str(formData, "icon", "⭐"),
    image: image || null,
    order: num(formData, "order"),
  };
  if (!data.title || !data.year) return;
  if (id) await prisma.milestone.update({ where: { id }, data });
  else await prisma.milestone.create({ data });
  refreshPublic();
  revalidatePath("/admin/timeline");
}

export async function deleteMilestoneAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.milestone.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/timeline");
}

/* ---------- messages ---------- */

export async function toggleMessageReadAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id");
  const msg = await prisma.message.findUnique({ where: { id } });
  if (msg) {
    await prisma.message.update({ where: { id }, data: { read: !msg.read } });
  }
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.message.delete({ where: { id: num(formData, "id") } });
  revalidatePath("/admin/messages");
}

/* ---------- videos ---------- */

export async function saveVideoAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  const id = num(formData, "id", 0);
  const data = {
    youtubeId: str(formData, "youtubeId"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    thumbnail: str(formData, "thumbnail"),
    category: str(formData, "category", "video"),
    duration: str(formData, "duration", "10:00"),
    timeAgo: str(formData, "timeAgo", "1 week ago"),
    sticker: str(formData, "sticker", "⭐"),
    featured: formData.get("featured") === "on",
    order: num(formData, "order"),
  };
  // youtubeId may be left blank for a "coming soon" video — the homepage
  // falls back to a subscribe card instead of embedding a real player.
  if (!data.title) return;
  if (id) await prisma.video.update({ where: { id }, data });
  else await prisma.video.create({ data });
  refreshPublic();
  revalidatePath("/admin/videos");
}

export async function deleteVideoAction(formData: FormData) {
  const prisma = await getDb();
  if (!prisma) return;
  await prisma.video.delete({ where: { id: num(formData, "id") } });
  refreshPublic();
  revalidatePath("/admin/videos");
}
