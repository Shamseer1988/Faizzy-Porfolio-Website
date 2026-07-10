"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { id: "top", icon: "🏠", label: "Home" },
  { id: "story", icon: "📖", label: "My Story" },
  { id: "about", icon: "🙋", label: "About" },
  { id: "journey", icon: "🕰️", label: "Journey" },
  { id: "skills", icon: "🔧", label: "Skills" },
  { id: "projects", icon: "🚀", label: "Projects" },
  { id: "youtube", icon: "🎬", label: "YouTube" },
  { id: "family", icon: "👨‍👩‍👧‍👦", label: "Family" },
  { id: "contact", icon: "📬", label: "Contact" },
];

// Floating dock: hidden on hero, replaced by a scroll hint.
// On all other sections it becomes the full icon rail.
export default function SideDock() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    for (const item of ITEMS) {
      const el = document.getElementById(item.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // On the hero, show a scroll-down hint in the same position
  if (active === "top") {
    return (
      <a href="#story" className="dock-scroll-hint" aria-label="Scroll to next section">
        <span className="dock-scroll-label">SCROLL</span>
        <i className="dock-scroll-arrow">↓</i>
      </a>
    );
  }

  return (
    <nav className="dock" aria-label="Section navigation">
      {ITEMS.filter((i) => i.id !== "top").map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? "on" : undefined}
          aria-label={item.label}
        >
          <i aria-hidden="true">{item.icon}</i>
          <span className="lbl">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
