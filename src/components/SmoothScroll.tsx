"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Buttery inertial scrolling (Apple-product-page feel) for the whole site.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis drives the scroll position itself; native CSS smooth-scrolling
    // would fight it on anchor jumps.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });

    lenis.on("scroll", (e) => {
      const velocity = Math.max(-25, Math.min(25, e.velocity));
      const speed = Math.abs(velocity);
      html.style.setProperty("--scroll-velocity", `${velocity}`);
      html.style.setProperty("--scroll-speed", `${speed}`);
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  return null;
}
