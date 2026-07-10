import Link from "next/link";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="card admin-side">
        <Link href="/admin">📊 Dashboard</Link>
        <Link href="/admin/profile">👤 Profile</Link>
        <Link href="/admin/skills">🔧 Skills &amp; Hobbies</Link>
        <Link href="/admin/projects">🚀 Projects</Link>
        <Link href="/admin/timeline">🕰 Timeline</Link>
        <Link href="/admin/family">👨‍👩‍👧‍👦 Family &amp; Gallery</Link>
        <Link href="/admin/videos">🎬 Videos</Link>
        <Link href="/admin/messages">📬 Messages</Link>
        <Link href="/" target="_blank">
          🌐 View site
        </Link>
        <form action={logoutAction}>
          <button className="btn btn-ghost btn-sm" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            Log out
          </button>
        </form>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
