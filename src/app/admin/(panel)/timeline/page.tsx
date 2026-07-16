import { getDb } from "@/lib/db";
import MediaUpload from "@/components/admin/MediaUpload";
import { saveMilestoneAction, deleteMilestoneAction } from "../../actions";

export const dynamic = "force-dynamic";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--stroke)",
  background: "var(--glass-2)",
  color: "var(--text)",
};

export default async function AdminTimeline() {
  const prisma = await getDb();
  const milestones = prisma
    ? await prisma.milestone.findMany({ orderBy: { order: "asc" } })
    : [];

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 6 }}>🕰 Life timeline</h2>
        <p style={{ margin: 0 }}>
          Zohan&apos;s story from birth to today — each milestone appears on the homepage
          &quot;Born to build&quot; section with scroll animations. Photos are optional:
          add the file to <code>public/images/</code> first, then use its path (e.g.{" "}
          <code>/images/new-photo.jpg</code>).
        </p>
      </div>
      {[...milestones, null].map((m) => (
        <form className="card" key={m?.id ?? "new"} action={saveMilestoneAction}>
          <h3 style={{ marginBottom: 14 }}>
            {m ? `${m.icon} ${m.year} — ${m.title}` : "➕ New milestone"}
          </h3>
          <input type="hidden" name="id" value={m?.id ?? ""} />
          <div style={{ display: "grid", gridTemplateColumns: "90px 80px 1fr 90px", gap: 12 }}>
            <div className="field">
              <label>Year</label>
              <input name="year" defaultValue={m?.year ?? ""} required style={inputStyle} />
            </div>
            <div className="field">
              <label>Icon</label>
              <input name="icon" defaultValue={m?.icon ?? "⭐"} style={inputStyle} />
            </div>
            <div className="field">
              <label>Title</label>
              <input name="title" defaultValue={m?.title ?? ""} required style={inputStyle} />
            </div>
            <div className="field">
              <label>Order</label>
              <input
                name="order"
                type="number"
                defaultValue={m?.order ?? milestones.length + 1}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="field">
            <label>Story</label>
            <textarea name="story" defaultValue={m?.story ?? ""} />
          </div>
          <MediaUpload
            name="image"
            defaultValue={m?.image ?? ""}
            label="Photo (optional — upload to R2 or paste a URL)"
            accept="image/*"
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-sm" type="submit">
              {m ? "💾 Save" : "➕ Add milestone"}
            </button>
            {m && (
              <button className="btn btn-danger btn-sm" formAction={deleteMilestoneAction} formNoValidate>
                Delete
              </button>
            )}
          </div>
        </form>
      ))}
    </>
  );
}
