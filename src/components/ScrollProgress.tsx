"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Thin gradient bar at the very top showing reading progress.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: "0 50%",
        zIndex: 80,
        background: "linear-gradient(90deg, var(--cyan), var(--lime), var(--amber))",
      }}
    />
  );
}
