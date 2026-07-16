import { getDb } from "@/lib/db";
import {
  saveSkillAction,
  deleteSkillAction,
  saveHobbyAction,
  deleteHobbyAction,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminSkills() {
  const prisma = await getDb();
  const [skills, hobbies] = prisma
    ? await Promise.all([
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.hobby.findMany({ orderBy: { order: "asc" } }),
      ])
    : [[], []];

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 14 }}>🔧 Maker skills (bars)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 90 }}>%</th>
              <th style={{ width: 80 }}>Order</th>
              <th style={{ width: 170 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...skills, null].map((s) => (
              <tr key={s?.id ?? "new"}>
                <td colSpan={4} style={{ padding: 0, border: "none" }}>
                  <form
                    action={saveSkillAction}
                    style={{ display: "flex", gap: 8, padding: "8px 0", alignItems: "center", flexWrap: "wrap" }}
                  >
                    <input type="hidden" name="id" value={s?.id ?? ""} />
                    <input
                      name="name"
                      defaultValue={s?.name ?? ""}
                      placeholder="New skill name…"
                      required
                      style={{ flex: "2 1 220px", padding: "9px 12px", borderRadius: 10, border: "1px solid var(--stroke)", background: "var(--glass-2)", color: "var(--text)" }}
                    />
                    <input
                      name="percent"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={s?.percent ?? 50}
                      style={{ width: 80, padding: "9px 12px", borderRadius: 10, border: "1px solid var(--stroke)", background: "var(--glass-2)", color: "var(--text)" }}
                    />
                    <input
                      name="order"
                      type="number"
                      defaultValue={s?.order ?? skills.length + 1}
                      style={{ width: 70, padding: "9px 12px", borderRadius: 10, border: "1px solid var(--stroke)", background: "var(--glass-2)", color: "var(--text)" }}
                    />
                    <button className="btn btn-primary btn-sm" type="submit">
                      {s ? "Save" : "Add"}
                    </button>
                    {s && (
                      <button
                        className="btn btn-danger btn-sm"
                        formAction={deleteSkillAction}
                        formNoValidate
                      >
                        Delete
                      </button>
                    )}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 14 }}>🎮 Hobbies (chips)</h2>
        {[...hobbies, null].map((h) => (
          <form
            key={h?.id ?? "new"}
            action={saveHobbyAction}
            style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "center", flexWrap: "wrap" }}
          >
            <input type="hidden" name="id" value={h?.id ?? ""} />
            <input
              name="label"
              defaultValue={h?.label ?? ""}
              placeholder="New hobby (emoji + name)…"
              required
              style={{ flex: "2 1 220px", padding: "9px 12px", borderRadius: 10, border: "1px solid var(--stroke)", background: "var(--glass-2)", color: "var(--text)" }}
            />
            <input
              name="order"
              type="number"
              defaultValue={h?.order ?? hobbies.length + 1}
              style={{ width: 70, padding: "9px 12px", borderRadius: 10, border: "1px solid var(--stroke)", background: "var(--glass-2)", color: "var(--text)" }}
            />
            <button className="btn btn-primary btn-sm" type="submit">
              {h ? "Save" : "Add"}
            </button>
            {h && (
              <button className="btn btn-danger btn-sm" formAction={deleteHobbyAction} formNoValidate>
                Delete
              </button>
            )}
          </form>
        ))}
      </div>
    </>
  );
}
