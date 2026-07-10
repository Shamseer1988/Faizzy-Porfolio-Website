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

    // Velocity-reactive CSS vars for image effects. Derived from the real
    // scroll position delta each frame (not Lenis events): smooth by
    // construction, and guaranteed to read exactly 0 once the page stops.
    let smoothVelocity = 0;
    let lastY = window.scrollY;
    let lastT = 0;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      const dt = lastT ? Math.min((time - lastT) / 1000, 0.1) : 1 / 60;
      lastT = time;
      const y = window.scrollY;
      // ignore sub-pixel chatter from Lenis chasing fractional targets
      const delta = Math.abs(y - lastY) < 0.75 ? 0 : y - lastY;
      // normalise to px-per-60fps-frame so feel is refresh-rate independent
      const frameVelocity = Math.max(-25, Math.min(25, (delta / Math.max(dt, 1 / 240)) * 0.0075));
      lastY = y;
      // time-based easing: same settle speed at 20fps or 144fps
      smoothVelocity += (frameVelocity - smoothVelocity) * Math.min(1, dt * 9);
      if (Math.abs(smoothVelocity) < 0.05 && frameVelocity === 0) smoothVelocity = 0;
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
