"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

// Apple-style hero exit: as you scroll past, the copy and the photo drift
// upward at different speeds while fading and gently scaling away.
export default function HeroFx({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <header className="hero" ref={ref}>
      <motion.div style={reduce ? undefined : { y: yLeft, opacity }}>{left}</motion.div>
      <motion.div style={reduce ? undefined : { y: yRight, opacity, scale }}>
        {right}
      </motion.div>
    </header>
  );
}
