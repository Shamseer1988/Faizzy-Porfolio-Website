import { getDb } from "@/lib/db";
import MediaUpload from "@/components/admin/MediaUpload";
import {
  saveFamilyAction,
  deleteFamilyAction,
  saveGalleryAction,
  deleteGalleryAction,
} from "../../actions";

export const dynamic = "force-dynamic";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--stroke)",
  background: "var(--glass-2)",
  color: "var(--text)",
};

export default async function AdminFamily() {
  const prisma = await getDb();
  const [family, gallery] = prisma
    ? await Promise.all([
        prisma.familyMember.findMany({ orderBy: { order: "asc" } }),
        prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
      ])
    : [[], []];

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 14 }}>👨‍👩‍👧‍👦 Family members</h2>
        {[...family, null].map((f) => (
          <form
            key={f?.id ?? "new"}
            action={saveFamilyAction}
            style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "center", flexWrap: "wrap" }}
          >
            <input type="hidden" name="id" value={f?.id ?? ""} />
            <input name="emoji" defaultValue={f?.emoji ?? "🙂"} style={{ ...inputStyle, width: 60 }} aria-label="Emoji" />
            <input
              name="name"
              defaultValue={f?.name ?? ""}
              placeholder="Name…"
              required
              style={{ ...inputStyle, flex: "1 1 180px" }}
              aria-label="Name"
            />
            <input
              name="relation"
              defaultValue={f?.relation ?? ""}
              placeholder="Relation · fun title"
              style={{ ...inputStyle, flex: "1 1 220px" }}
              aria-label="Relation"
            />
            <input name="order" type="number" defaultValue={f?.order ?? family.length + 1} style={{ ...inputStyle, width: 70 }} aria-label="Order" />
            <button className="btn btn-primary btn-sm" type="submit">
              {f ? "Save" : "Add"}
            </button>
            {f && (
              <button className="btn btn-danger btn-sm" formAction={deleteFamilyAction} formNoValidate>
                Delete
              </button>
            )}
          </form>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 6 }}>🖼 Gallery</h2>
        <p style={{ marginBottom: 14 }}>
          Use <b>⬆ Upload</b> to send a photo straight to Cloudflare R2, or paste an
          existing image URL.
        </p>
        {[...gallery, null].map((g) => (
          <form
            key={g?.id ?? "new"}
            action={saveGalleryAction}
            style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "flex-start", flexWrap: "wrap" }}
          >
            <input type="hidden" name="id" value={g?.id ?? ""} />
            <MediaUpload name="src" defaultValue={g?.src ?? ""} accept="image/*" />
            <input
              name="caption"
              defaultValue={g?.caption ?? ""}
              placeholder="Caption…"
              style={{ ...inputStyle, flex: "1 1 220px" }}
              aria-label="Caption"
            />
            <input name="order" type="number" defaultValue={g?.order ?? gallery.length + 1} style={{ ...inputStyle, width: 70 }} aria-label="Order" />
            <button className="btn btn-primary btn-sm" type="submit">
              {g ? "Save" : "Add"}
            </button>
            {g && (
              <button className="btn btn-danger btn-sm" formAction={deleteGalleryAction} formNoValidate>
                Delete
              </button>
            )}
          </form>
        ))}
      </div>
    </>
  );
}
