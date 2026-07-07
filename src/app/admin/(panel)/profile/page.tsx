import { prisma } from "@/lib/db";
import { updateProfileAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminProfile() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) {
    return (
      <div className="card">
        <h2>Profile not found</h2>
        <p>
          Run <code>npm run db:setup</code> to seed the database first.
        </p>
      </div>
    );
  }

  return (
    <form className="card" action={updateProfileAction}>
      <h2 style={{ marginBottom: 18 }}>👤 Profile</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div className="field">
          <label htmlFor="displayFirst">First word</label>
          <input id="displayFirst" name="displayFirst" defaultValue={profile.displayFirst} />
        </div>
        <div className="field">
          <label htmlFor="displayHighlight">Highlighted word</label>
          <input id="displayHighlight" name="displayHighlight" defaultValue={profile.displayHighlight} />
        </div>
        <div className="field">
          <label htmlFor="displayLast">Last word</label>
          <input id="displayLast" name="displayLast" defaultValue={profile.displayLast} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" defaultValue={profile.fullName} />
      </div>
      <div className="field">
        <label htmlFor="roles">Rotating roles (one per line)</label>
        <textarea id="roles" name="roles" defaultValue={profile.roles.join("\n")} />
      </div>
      <div className="field">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" defaultValue={profile.bio} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div className="field">
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" defaultValue={profile.age} />
        </div>
        <div className="field">
          <label htmlFor="className">Class</label>
          <input id="className" name="className" defaultValue={profile.className} />
        </div>
        <div className="field">
          <label htmlFor="projectsCount">Projects count</label>
          <input id="projectsCount" name="projectsCount" type="number" defaultValue={profile.projectsCount} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="school">School</label>
        <input id="school" name="school" defaultValue={profile.school} />
      </div>
      <div className="field">
        <label htmlFor="house">House</label>
        <input id="house" name="house" defaultValue={profile.house} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="field">
          <label htmlFor="youtubeUrl">YouTube URL</label>
          <input id="youtubeUrl" name="youtubeUrl" defaultValue={profile.youtubeUrl} />
        </div>
        <div className="field">
          <label htmlFor="youtubeHandle">YouTube handle</label>
          <input id="youtubeHandle" name="youtubeHandle" defaultValue={profile.youtubeHandle} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="statusTag">Hero status tag</label>
        <input id="statusTag" name="statusTag" defaultValue={profile.statusTag} />
      </div>
      <button className="btn btn-primary" type="submit">
        💾 Save profile
      </button>
    </form>
  );
}
