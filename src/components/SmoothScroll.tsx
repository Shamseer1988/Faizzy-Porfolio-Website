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
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      anchors: true,
    });

    // Expose Lenis globally so ScrollStory can snap-scroll to chapters
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Velocity-reactive CSS vars for image effects. Writing the raw Lenis
    // velocity every frame makes elements vibrate (each write restarts CSS
    // transitions), so we ease toward it in the rAF loop instead, decay it
    // when scrolling stops, and snap a small dead-zone to exactly zero.
    let targetVelocity = 0;
    let smoothVelocity = 0;
    lenis.on("scroll", (e: { velocity: number }) => {
      targetVelocity = Math.max(-25, Math.min(25, e.velocity));
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      targetVelocity *= 0.92;
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.1;
      if (Math.abs(smoothVelocity) < 0.05 && Math.abs(targetVelocity) < 0.05) {
        smoothVelocity = 0;
        targetVelocity = 0;
      }
      html.style.setProperty("--scroll-velocity", smoothVelocity.toFixed(3));
      html.style.setProperty("--scroll-speed", Math.abs(smoothVelocity).toFixed(3));
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  return null;
}
