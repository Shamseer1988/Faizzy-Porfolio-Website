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

// Cute floating dock: section bubbles on the right edge (bottom edge on
// phones) with hover labels and a scrollspy highlight.
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

  return (
    <nav className="dock" aria-label="Section navigation">
      {ITEMS.map((item) => (
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
