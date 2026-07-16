import { getDb } from "./db";
import { defaultContent, type SiteContent } from "./defaults";
import { parseList } from "./serialize";

// Loads all public site content from the database, falling back to the
// built-in defaults when no database is configured or reachable, so the
// site always renders (including static preview builds).
export async function getSiteContent(): Promise<SiteContent> {
  const prisma = await getDb();
  if (!prisma) return defaultContent;
  try {
    const [profile, skills, hobbies, projects, family, gallery, milestones, videos] =
      await Promise.all([
        prisma.profile.findUnique({ where: { id: 1 } }),
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.hobby.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.familyMember.findMany({ orderBy: { order: "asc" } }),
        prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
        prisma.milestone.findMany({ orderBy: { order: "asc" } }),
        prisma.video.findMany({
          where: { featured: true },
          orderBy: { order: "asc" },
          take: 5,
        }),
      ]);
    if (!profile) return defaultContent;
    return {
      profile: { ...profile, roles: parseList(profile.roles) },
      skills: skills.length ? skills : defaultContent.skills,
      hobbies: hobbies.length ? hobbies : defaultContent.hobbies,
      projects: projects.length
        ? projects.map((p) => ({ ...p, tools: parseList(p.tools) }))
        : defaultContent.projects,
      family: family.length ? family : defaultContent.family,
      gallery: gallery.length ? gallery : defaultContent.gallery,
      milestones: milestones.length ? milestones : defaultContent.milestones,
      videos: videos.length ? videos : defaultContent.videos,
    };
  } catch {
    return defaultContent;
  }
}
