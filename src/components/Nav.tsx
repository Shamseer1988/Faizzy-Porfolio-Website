import Link from "next/link";
import LiveClock from "./LiveClock";
import ThemeToggle from "./ThemeToggle";

// Minimal top bar: logo, live clock and theme toggle. Section links live
// in the floating SideDock on the right edge.
export default function Nav() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link className="logo" href="/#top">
          <span className="logo-badge">Z</span>
          Zohan<span style={{ color: "var(--cyan)" }}>.</span>
        </Link>
        <LiveClock variant="nav" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
