import Link from "next/link";
import LiveClock from "./LiveClock";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link className="logo" href="/#top">
          <span className="logo-badge">Z</span>
          Zohan<span style={{ color: "var(--cyan)" }}>.</span>
        </Link>
        <div className="nav-links">
          <Link href="/#about">About</Link>
          <Link href="/#skills">Skills</Link>
          <Link href="/#projects">Projects</Link>
          <Link href="/#youtube">YouTube</Link>
          <Link href="/#family">Family</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <LiveClock variant="nav" />
        <ThemeToggle />
      </div>
    </nav>
  );
}
