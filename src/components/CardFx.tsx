"use client";

import { useEffect } from "react";

// Cursor-reactive card effects for every .card on the site: a spotlight
// that follows the pointer plus a gentle 3D tilt, driven by CSS variables
// so a single delegated listener covers all cards cheaply.
export default function CardFx() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last: HTMLElement | null = null;

    const clear = (el: HTMLElement) => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };

    const onMove = (e: PointerEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const card = (e.target as Element | null)?.closest?.(".card") as HTMLElement | null;
      if (last && last !== card) clear(last);
      last = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      card.style.setProperty("--rx", `${((px - 0.5) * 6).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(-(py - 0.5) * 6).toFixed(2)}deg`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (last) clear(last);
    };
  }, []);

  return null;
}
