import { prisma } from "@/lib/db";
import { toggleMessageReadAction, deleteMessageAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="card">
      <h2 style={{ marginBottom: 14 }}>📬 Messages ({messages.length})</h2>
      {messages.length === 0 && <p>No messages yet. Share the site and they&apos;ll arrive here!</p>}
      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            borderBottom: "1px solid var(--stroke)",
            padding: "14px 0",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className={`admin-badge${m.read ? "" : " unread"}`}>
              {m.read ? "read" : "new"}
            </span>
            <b>{m.name}</b>
            <a href={`mailto:${m.email}`} style={{ color: "var(--cyan)", fontSize: 13 }}>
              {m.email}
            </a>
            <span style={{ color: "var(--faint)", fontSize: 12, marginLeft: "auto" }}>
              {m.createdAt.toLocaleString()}
            </span>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.body}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <form action={toggleMessageReadAction}>
              <input type="hidden" name="id" value={m.id} />
              <button className="btn btn-ghost btn-sm" type="submit">
                Mark {m.read ? "unread" : "read"}
              </button>
            </form>
            <form action={deleteMessageAction}>
              <input type="hidden" name="id" value={m.id} />
              <button className="btn btn-danger btn-sm" type="submit">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
