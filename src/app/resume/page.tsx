import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import PrintButton from "@/components/PrintButton";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Muhammed Zohan Faizzy — young coder, AI robot builder and footballer.",
};

export const revalidate = 60;

export default async function ResumePage() {
  const { profile, skills, hobbies, projects, family } = await getSiteContent();
  const father = family.find((f) => f.relation.toLowerCase().includes("father"));
  const mother = family.find((f) => f.relation.toLowerCase().includes("mother"));

  return (
    <>
      <Nav />
      <main className="resume-page">
        <header style={{ borderBottom: "2px solid var(--stroke-2)", paddingBottom: 18, marginBottom: 22 }}>
          <h1 style={{ fontSize: 34 }}>{profile.fullName}</h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0", fontWeight: 600 }}>
            Young Coder · AI Robot Builder · Smart-Home Captain · Footballer
          </p>
          <p style={{ color: "var(--muted)", margin: "4px 0 0", fontSize: 14 }}>
            {profile.house} · Class {profile.className}, {profile.school} · YouTube:{" "}
            {profile.youtubeHandle}
          </p>
        </header>

        <section style={{ padding: "0 0 18px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>About</h2>
          <p style={{ margin: 0, fontSize: 14.5 }}>{profile.bio}</p>
        </section>

        <section style={{ padding: "0 0 18px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Maker Skills</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5 }}>
            {skills.map((s) => (
              <li key={s.id}>
                {s.name} — {s.percent}%
              </li>
            ))}
          </ul>
        </section>

        <section style={{ padding: "0 0 18px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Projects</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5 }}>
            {projects.map((p) => (
              <li key={p.id} style={{ marginBottom: 6 }}>
                <b>
                  {p.icon} {p.title}
                </b>{" "}
                ({p.tag}) — {p.description}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ padding: "0 0 18px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Hobbies</h2>
          <p style={{ margin: 0, fontSize: 14.5 }}>{hobbies.map((h) => h.label).join(" · ")}</p>
        </section>

        <section style={{ padding: "0 0 6px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Guardians</h2>
          <p style={{ margin: 0, fontSize: 14.5 }}>
            {father ? `Father: ${father.name}` : ""}
            {father && mother ? " · " : ""}
            {mother ? `Mother: ${mother.name}` : ""}
          </p>
        </section>

        <div className="no-print" style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <PrintButton />
          <Link className="btn btn-ghost" href="/">
            ← Back to site
          </Link>
        </div>
      </main>
    </>
  );
}
