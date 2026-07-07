import type { Metadata } from "next";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <form className="card" action={loginAction} style={{ width: "min(400px, 92vw)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span className="logo-badge" style={{ margin: "0 auto 10px", display: "inline-grid" }}>
            Z
          </span>
          <h1 style={{ fontSize: 24 }}>Mission Control</h1>
          <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "6px 0 0" }}>
            Admin login for Zohan&apos;s portfolio
          </p>
        </div>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" required autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
          🔐 Log in
        </button>
        {error && <p className="form-note err">Wrong username or password. Try again.</p>}
      </form>
    </main>
  );
}
