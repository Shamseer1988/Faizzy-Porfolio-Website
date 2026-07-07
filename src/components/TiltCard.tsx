"use client";

import { useRef } from "react";

// 3D-tilts its children toward the cursor (pointer devices only).
export default function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "rotateY(0) rotateX(0)";
  }

  return (
    <div className="hero-visual" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tilt-card" ref={ref}>
        {children}
      </div>
    </div>
  );
}
