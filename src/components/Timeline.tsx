"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import type { MilestoneContent } from "@/lib/defaults";

// Pinned "journey deck": the section holds one viewport while scrolling
// flips through the milestones — the top card tosses off the stack, the
// story text swaps in place and the year rail fills up.
export default function Timeline({ milestones }: { milestones: MilestoneContent[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const n = milestones.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 130, damping: 26 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.max(0, Math.min(n - 1, Math.floor(v * n)));
    if (i !== active) setActive(i);
  });

  const m = milestones[active];
  if (!m) return null;

  if (reduce) {
    // Compact static grid for reduced-motion visitors.
    return (
      <div className="jd-static">
        {milestones.map((ms) => (
          <div className="card" key={ms.id}>
            <span className="tl-year">
              {ms.icon} {ms.year}
            </span>
            <h3 style={{ fontSize: 19, margin: "8px 0 6px" }}>{ms.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{ms.story}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="jd-outer" ref={ref} style={{ height: `${n * 58}vh` }}>
      <div className="jd-sticky">
        {/* year rail with scroll-linked fill */}
        <div className="jd-rail" aria-hidden="true">
          <motion.i className="jd-rail-fill" style={{ scaleX: fill }} />
          {milestones.map((ms, i) => (
            <span key={ms.id} className={`jd-year${i === active ? " on" : ""}`}>
              {ms.year}
            </span>
          ))}
        </div>

        <div className="jd-body">
          {/* story text swaps in place */}
          <div className="jd-text">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="tl-year">
                  {m.icon} {m.year}
                </span>
                <h3 className="jd-title">{m.title}</h3>
                <p className="jd-story">{m.story}</p>
              </motion.div>
            </AnimatePresence>
            <div className="jd-count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </div>
          </div>

          {/* card deck: active card in front, older cards toss off left */}
          <div className="jd-deck">
            {milestones.map((ms, i) => {
              const off = i - active;
              const gone = off < 0;
              return (
                <motion.div
                  key={ms.id}
                  className="jd-card"
                  style={{ zIndex: n - Math.abs(off) }}
                  initial={false}
                  animate={
                    gone
                      ? { x: -360, y: -40, rotate: -26, opacity: 0, scale: 0.9 }
                      : {
                          x: off * 12,
                          y: off * 16,
                          rotate: off * 4,
                          opacity: off > 3 ? 0 : 1 - off * 0.14,
                          scale: 1 - off * 0.05,
                        }
                  }
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                >
                  {ms.image ? (
                    <div className="jd-photo">
                      <Image
                        src={ms.image}
                        alt={ms.title}
                        fill
                        sizes="(max-width: 820px) 80vw, 420px"
                      />
                    </div>
                  ) : (
                    <div className="jd-photo jd-emoji">
                      <span>{ms.icon}</span>
                    </div>
                  )}
                  <span className="jd-chip">
                    {ms.icon} {ms.year}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
