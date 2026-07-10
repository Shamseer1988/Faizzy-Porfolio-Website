import { prisma } from "@/lib/db";
import { saveVideoAction, deleteVideoAction } from "../../actions";

export const dynamic = "force-dynamic";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--stroke)",
  background: "var(--glass-2)",
  color: "var(--text)",
};

export default async function AdminVideos() {
  const videos = await prisma.video.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 6 }}>🎬 YouTube Videos</h2>
        <p style={{ margin: 0 }}>
          Manage videos shown on the homepage in the &quot;Creator Zone&quot;.
          You can feature up to 4 videos. Provide the YouTube 11-character video ID
          (e.g., for <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>, the ID is <code>dQw4w9WgXcQ</code>) —
          or leave it blank to show a &quot;coming soon&quot; card until the real video is uploaded.
        </p>
      </div>

      {[...videos, null].map((v) => (
        <form className="card" key={v?.id ?? "new"} action={saveVideoAction}>
          <h3 style={{ marginBottom: 14 }}>
            {v ? `📹 ${v.title}` : "🎬 Add a YouTube Video"}
          </h3>
          <input type="hidden" name="id" value={v?.id ?? ""} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 12, marginBottom: 12 }}>
            <div className="field">
              <label>YouTube Video ID (leave blank for &quot;coming soon&quot;)</label>
              <input
                name="youtubeId"
                defaultValue={v?.youtubeId ?? ""}
                placeholder="e.g. dQw4w9WgXcQ"
                style={inputStyle}
              />
            </div>
            <div className="field">
              <label>Category (e.g. Football, Robots, Games)</label>
              <input
                name="category"
                defaultValue={v?.category ?? "Robots"}
                placeholder="Category tag"
                style={inputStyle}
              />
            </div>
            <div className="field">
              <label>Order</label>
              <input
                name="order"
                type="number"
                defaultValue={v?.order ?? videos.length + 1}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 12, marginBottom: 12 }}>
            <div className="field">
              <label>Duration (e.g. 12:45)</label>
              <input
                name="duration"
                defaultValue={v?.duration ?? "10:00"}
                placeholder="e.g. 12:45"
                style={inputStyle}
              />
            </div>
            <div className="field">
              <label>Time Ago (e.g. 2 days ago)</label>
              <input
                name="timeAgo"
                defaultValue={v?.timeAgo ?? "1 week ago"}
                placeholder="e.g. 2 days ago"
                style={inputStyle}
              />
            </div>
            <div className="field">
              <label>Sticker Emoji (e.g. 🤖, 🏆, 🚲)</label>
              <input
                name="sticker"
                defaultValue={v?.sticker ?? "⭐"}
                placeholder="e.g. 🤖"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Title (required)</label>
            <input
              name="title"
              defaultValue={v?.title ?? ""}
              required
              placeholder="Video Title"
              style={inputStyle}
            />
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label>Description</label>
            <textarea
              name="description"
              defaultValue={v?.description ?? ""}
              placeholder="Short description of what the video is about..."
              style={{ minHeight: 70 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center", marginBottom: 16 }}>
            <div className="field">
              <label>Custom Thumbnail URL (optional — leave blank for YouTube default)</label>
              <input
                name="thumbnail"
                defaultValue={v?.thumbnail ?? ""}
                placeholder="/images/custom-thumb.jpg or external url"
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
              <input
                type="checkbox"
                name="featured"
                id={`feat-${v?.id ?? "new"}`}
                defaultChecked={v?.featured ?? true}
              />
              <label htmlFor={`feat-${v?.id ?? "new"}`} style={{ fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>
                Featured on home
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-sm" type="submit">
              {v ? "💾 Save Video" : "➕ Add Video"}
            </button>
            {v && (
              <button
                className="btn btn-danger btn-sm"
                formAction={deleteVideoAction}
                formNoValidate
              >
                Delete
              </button>
            )}
          </div>
        </form>
      ))}
    </>
  );
}
