import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

// Two independent floating glass chips — avatar logo (left) + theme toggle (right).
// Centre is fully transparent so the hero scene shows through with no bar.
export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Site navigation">
      {/* Avatar logo pill — left */}
      <Link className="nav-avatar-pill" href="/#top" aria-label="Back to top">
        <span className="nav-avatar-wrap">
          <Image
            src="/images/face.png"
            alt="Zohan"
            width={42}
            height={42}
            className="nav-avatar-img"
            priority
          />
        </span>
        <span className="nav-avatar-name">
          Zohan<span className="nav-avatar-dot">.</span>
        </span>
      </Link>

      {/* Theme toggle pill — right */}
      <div className="nav-toggle-pill">
        <ThemeToggle />
      </div>
    </nav>
  );
}

