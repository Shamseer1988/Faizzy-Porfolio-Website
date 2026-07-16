import { getDb } from "@/lib/db";
import { parseList } from "@/lib/serialize";
import { saveProjectAction, deleteProjectAction } from "../../actions";

export const dynamic = "force-dynamic";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--stroke)",
  background: "var(--glass-2)",
  color: "var(--text)",
  width: "100%",
};

export default async function AdminProjects() {
  const prisma = await getDb();
  const projects = prisma ? await prisma.project.findMany({ orderBy: { order: "asc" } }) : [];

  return (
    <>
      {[...projects, null].map((p) => (
        <form className="card" key={p?.id ?? "new"} action={saveProjectAction}>
          <h2 style={{ marginBottom: 14 }}>
            {p ? `${p.icon} ${p.title}` : "➕ New project"}
          </h2>
          <input type="hidden" name="id" value={p?.id ?? ""} />
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Icon</label>
              <input name="icon" defaultValue={p?.icon ?? "💡"} style={inputStyle} />
            </div>
            <div className="field">
              <label>Title</label>
              <input name="title" defaultValue={p?.title ?? ""} required style={inputStyle} />
            </div>
            <div className="field">
              <label>Tag (badge text)</label>
              <input name="tag" defaultValue={p?.tag ?? ""} style={inputStyle} />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" defaultValue={p?.description ?? ""} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 90px 110px", gap: 12, alignItems: "end" }}>
            <div className="field">
              <label>Tools (comma-separated)</label>
              <input name="tools" defaultValue={p ? parseList(p.tools).join(", ") : ""} style={inputStyle} />
            </div>
            <div className="field">
              <label>Accent</label>
              <select name="accent" defaultValue={p?.accent ?? "cyan"}>
                <option value="cyan">Cyan</option>
                <option value="lime">Lime</option>
                <option value="amber">Amber</option>
              </select>
            </div>
            <div className="field">
              <label>Order</label>
              <input name="order" type="number" defaultValue={p?.order ?? projects.length + 1} style={inputStyle} />
            </div>
            <div className="field">
              <label>Visible</label>
              <input name="visible" type="checkbox" defaultChecked={p?.visible ?? true} style={{ width: 22, height: 22 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-sm" type="submit">
              {p ? "💾 Save" : "➕ Add project"}
            </button>
            {p && (
              <button className="btn btn-danger btn-sm" formAction={deleteProjectAction} formNoValidate>
                Delete
              </button>
            )}
          </div>
        </form>
      ))}
    </>
  );
}
