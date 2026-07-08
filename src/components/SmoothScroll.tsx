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
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
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
