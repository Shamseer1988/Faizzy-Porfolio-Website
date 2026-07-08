import { prisma, hasDatabase } from "./db";
import { defaultContent, type SiteContent } from "./defaults";

// Loads all public site content from PostgreSQL, falling back to the
// built-in defaults when no database is configured or reachable, so the
// site always renders (including static preview builds).
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasDatabase()) return defaultContent;
  try {
    const [profile, skills, hobbies, projects, family, gallery, milestones] =
      await Promise.all([
        prisma.profile.findUnique({ where: { id: 1 } }),
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.hobby.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.familyMember.findMany({ orderBy: { order: "asc" } }),
        prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
        prisma.milestone.findMany({ orderBy: { order: "asc" } }),
      ]);
    if (!profile) return defaultContent;
    return {
      profile,
      skills: skills.length ? skills : defaultContent.skills,
      hobbies: hobbies.length ? hobbies : defaultContent.hobbies,
      projects: projects.length ? projects : defaultContent.projects,
      family: family.length ? family : defaultContent.family,
      gallery: gallery.length ? gallery : defaultContent.gallery,
      milestones: milestones.length ? milestones : defaultContent.milestones,
    };
  } catch {
    return defaultContent;
  }
}
