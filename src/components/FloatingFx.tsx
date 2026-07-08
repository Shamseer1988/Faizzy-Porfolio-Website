"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";

type SpriteType = "butterfly" | "kick" | "slide" | "swing" | "float";

type Sprite = {
  emoji: string;
  top: number; // % of page height
  left?: number; // % from left
  right?: number; // % from right
  size: number;
  type: SpriteType;
  dur?: number;
};

// Playful ambient sprites scattered down the whole page. Each one wakes up
// when scrolled into view: butterflies flutter, the football gets kicked,
// the skateboard slides, the bat swings.
const SPRITES: Sprite[] = [
  { emoji: "🦋", top: 7, left: 5, size: 30, type: "butterfly", dur: 8 },
  { emoji: "⚽", top: 14, right: 4, size: 34, type: "kick" },
  { emoji: "🦋", top: 22, right: 9, size: 24, type: "butterfly", dur: 10 },
  { emoji: "🛹", top: 30, left: 3, size: 34, type: "slide" },
  { emoji: "🏏", top: 38, right: 5, size: 34, type: "swing" },
  { emoji: "🎈", top: 45, left: 7, size: 30, type: "float", dur: 5 },
  { emoji: "🦋", top: 53, left: 4, size: 26, type: "butterfly", dur: 9 },
  { emoji: "⚽", top: 61, left: 8, size: 28, type: "kick" },
  { emoji: "🤖", top: 68, right: 6, size: 32, type: "float", dur: 4 },
  { emoji: "🦋", top: 76, right: 4, size: 28, type: "butterfly", dur: 7 },
  { emoji: "🚴", top: 84, left: 5, size: 32, type: "slide" },
  { emoji: "✨", top: 91, right: 8, size: 26, type: "float", dur: 3.5 },
];

function animationFor(s: Sprite): TargetAndTransition {
  const dur = s.dur ?? 6;
  switch (s.type) {
    case "butterfly":
      return {
        x: [0, 28, -18, 24, 0],
        y: [0, -34, -12, -40, 0],
        rotate: [0, 14, -12, 10, 0],
        transition: { duration: dur, repeat: Infinity, ease: "easeInOut" },
      };
    case "kick":
      return {
        x: [0, 70, 170],
        y: [0, -52, 6],
        rotate: [0, 200, 400],
        opacity: [0, 1, 0],
        transition: { duration: 1.7, repeat: Infinity, repeatDelay: 2.4, ease: "easeOut" },
      };
    case "slide":
      return {
        x: [0, 52, 0, -52, 0],
        rotate: [0, 8, 0, -8, 0],
        transition: { duration: dur, repeat: Infinity, ease: "easeInOut" },
      };
    case "swing":
      return {
        rotate: [-38, 48, -38],
        transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" },
      };
    case "float":
      return {
        y: [0, -20, 0],
        rotate: [0, 6, 0],
        transition: { duration: dur, repeat: Infinity, ease: "easeInOut" },
      };
  }
}

export default function FloatingFx() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Sprites are client-only decoration; render them after hydration so the
    // server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (reduce || !mounted) return null;

  return (
    <div className="fx-layer" aria-hidden="true">
      {SPRITES.map((s, i) => (
        <motion.span
          key={i}
          className="fx-sprite"
          style={{
            top: `${s.top}%`,
            left: s.left !== undefined ? `${s.left}%` : undefined,
            right: s.right !== undefined ? `${s.right}%` : undefined,
            fontSize: s.size,
            transformOrigin: s.type === "swing" ? "20% 90%" : "center",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ margin: "60px" }}
        >
          <motion.span style={{ display: "inline-block" }} animate={animationFor(s)}>
            {s.emoji}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
