import Link from "next/link";
import { prisma, hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!hasDatabase()) {
    return (
      <div className="card">
        <h2>No database configured</h2>
        <p>
          Set <code>DATABASE_URL</code> in <code>.env</code>, then run{" "}
          <code>npm run db:setup</code> to create and seed the tables.
        </p>
      </div>
    );
  }

  let counts: { skills: number; projects: number; family: number; gallery: number; messages: number; unread: number; videos: number };
  try {
    const [skills, projects, family, gallery, messages, unread, videos] = await Promise.all([
      prisma.skill.count(),
      prisma.project.count(),
      prisma.familyMember.count(),
      prisma.galleryItem.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.video.count(),
    ]);
    counts = { skills, projects, family, gallery, messages, unread, videos };
  } catch {
    return (
      <div className="card">
        <h2>Database unreachable</h2>
        <p>
          The site keeps working with its built-in content, but editing needs the
          database. Check that PostgreSQL is running and <code>DATABASE_URL</code> is
          correct, then run <code>npm run db:setup</code>.
        </p>
      </div>
    );
  }

  const tiles = [
    { label: "Skills", value: counts.skills, href: "/admin/skills" },
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Family members", value: counts.family, href: "/admin/family" },
    { label: "Gallery photos", value: counts.gallery, href: "/admin/family" },
    { label: "YouTube Videos", value: counts.videos, href: "/admin/videos" },
    { label: "Messages", value: counts.messages, href: "/admin/messages" },
    { label: "Unread messages", value: counts.unread, href: "/admin/messages" },
  ];

  return (
    <>
      <div className="card">
        <h2>Welcome back, Baba 👋</h2>
        <p>
          Everything on the public site is editable from here. Changes go live within a
          minute.
        </p>
      </div>
      <div className="bento">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card" style={{ textDecoration: "none" }}>
            <b
              style={{
                fontFamily: "Fredoka",
                fontSize: 30,
                color: t.label === "Unread messages" && t.value > 0 ? "var(--amber)" : "var(--cyan)",
              }}
            >
              {t.value}
            </b>
            <p>{t.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
