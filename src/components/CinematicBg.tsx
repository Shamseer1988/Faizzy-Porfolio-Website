"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x0: number;
  y0: number;
  r: number; // relative to min(viewport)
  color: number; // palette index
  speed: number;
  phase: number;
  depth: number; // scroll parallax factor
};

const DARK_PALETTE: [number, number, number][] = [
  [69, 227, 255], // cyan
  [169, 240, 107], // lime
  [255, 194, 75], // amber
  [122, 110, 255], // indigo
  [255, 107, 139], // rose
];
const LIGHT_PALETTE: [number, number, number][] = [
  [6, 147, 196],
  [92, 168, 43],
  [221, 144, 18],
  [104, 96, 226],
  [225, 77, 110],
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Full-page cinematic background: a canvas "aurora field" of soft light
// blobs that drift on their own and slide with parallax as you scroll —
// the whole site feels like it's playing over a slow ambient video.
// (A real <video> can replace this layer later without touching sections.)
export default function CinematicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rnd = mulberry32(20250710);
    const blobs: Blob[] = Array.from({ length: 8 }, (_, i) => ({
      x0: rnd(),
      y0: rnd(),
      r: 0.28 + rnd() * 0.3,
      color: i % 5,
      speed: 0.05 + rnd() * 0.08,
      phase: rnd() * Math.PI * 2,
      depth: 0.03 + rnd() * 0.1,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function isDark() {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark") return true;
      if (attr === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    let dark = isDark();
    const onTheme = () => {
      dark = isDark();
    };
    window.addEventListener("zohan-themechange", onTheme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onTheme);

    let lastY = window.scrollY;
    let scrollEnergy = 0;
    let frame = 0;
    let lastDraw = 0;

    function draw(time: number) {
      frame = requestAnimationFrame(draw);
      // ~30fps is plenty for slow ambient light
      if (time - lastDraw < 32) return;
      lastDraw = time;

      const y = window.scrollY;
      scrollEnergy += (Math.min(Math.abs(y - lastY), 60) - scrollEnergy) * 0.06;
      lastY = y;

      const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
      const baseAlpha = dark ? 0.085 : 0.11;
      const t = time / 1000;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = dark ? "lighter" : "source-over";

      const minDim = Math.min(w, h);
      for (const b of blobs) {
        const drift = t * b.speed;
        const bx = (b.x0 + Math.sin(drift + b.phase) * 0.08) * w;
        // parallax: each blob slides at its own depth; wraps around
        const span = h + minDim;
        let by = ((b.y0 * span - y * b.depth) % span) + Math.cos(drift * 0.8 + b.phase) * 0.05 * h;
        if (by < -minDim * 0.5) by += span;
        const r = b.r * minDim * (1 + Math.sin(drift * 1.4 + b.phase) * 0.08);
        const [cr, cg, cb] = palette[b.color];
        // scrolling makes the light breathe brighter — the "video" feel
        const alpha = baseAlpha + scrollEnergy * 0.0035;
        const grad = ctx!.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        grad.addColorStop(0.55, `rgba(${cr},${cg},${cb},${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(bx - r, by - r, r * 2, r * 2);
      }
    }

    if (reduce) {
      // single static frame for reduced-motion visitors
      draw(1000);
      cancelAnimationFrame(frame);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("zohan-themechange", onTheme);
      mq.removeEventListener("change", onTheme);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="bg-cinema" aria-hidden="true" />
      {/* translucent veil keeps text readable over the moving light */}
      <div className="bg-veil" aria-hidden="true" />
    </>
  );
}
