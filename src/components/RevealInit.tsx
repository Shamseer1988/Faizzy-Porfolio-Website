"use client";

import { useEffect } from "react";

// Activates scroll-reveal animations, skill bars and stat counters for
// every element rendered by the server components on the page.
export default function RevealInit() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
      document
        .querySelectorAll<HTMLElement>(".bar i[data-w]")
        .forEach((b) => (b.style.width = b.dataset.w ?? "0"));
      document
        .querySelectorAll<HTMLElement>("[data-count]")
        .forEach((c) => (c.textContent = c.dataset.count ?? ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>(".bar i[data-w]").forEach((b) => {
            b.style.width = b.dataset.w ?? "0";
          });
          el.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
            if (c.dataset.done) return;
            c.dataset.done = "1";
            const target = Number(c.dataset.count);
            const start = performance.now();
            const step = (t: number) => {
              const p = Math.min((t - start) / 900, 1);
              const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
              c.textContent = String(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.18 },
    );

    document
      .querySelectorAll(".rv, .card, .stat-row")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
