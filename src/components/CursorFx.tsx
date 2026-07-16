"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

type Burst = { id: number; x: number; y: number };

// Site-wide cursor companion: a bright dot glued to the pointer, a lazy
// glowing ring chasing it (growing over links/buttons), and a spark burst
// on every click. Fine-pointer devices only.
export default function CursorFx() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setHovering(Boolean(t?.closest?.("a, button, input, textarea, select, [role=button]")));
    };
    const onDown = (e: PointerEvent) => {
      const id = Date.now() + Math.random();
      setBursts((b) => [...b.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setBursts((b) => b.filter((s) => s.id !== id)), 650);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.7 : 1, opacity: hovering ? 0.9 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div key={b.id} className="cursor-burst" style={{ left: b.x, top: b.y }}>
            {Array.from({ length: 6 }, (_, i) => (
              <motion.i
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 34,
                  y: Math.sin((i / 6) * Math.PI * 2) * 34,
                  opacity: 0,
                  scale: 0.3,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
