"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import type { MilestoneContent } from "@/lib/defaults";

// Pinned "journey deck": the whole section holds one viewport while
// scrolling flips through the milestones — the header, year rail, story
// text and a big card stack all live inside the pinned frame so the view
// stays full and centred (no dead space above the deck).
export default function Timeline({ milestones }: { milestones: MilestoneContent[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const n = milestones.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 130, damping: 26 });
  // progress readout (0–100%) for the little meter under the deck
  const pct = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const pctWidth = useTransform(pct, (v) => `${Math.round(v * 100)}%`);

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
    <div className="jd-outer" ref={ref} style={{ height: `${n * 62}vh` }}>
      <div className="jd-sticky">
        <span className="jd-glow" aria-hidden="true" />
        <div className="jd-inner">
          {/* year rail with scroll-linked fill */}
          <div className="jd-rail" aria-hidden="true">
            <motion.i className="jd-rail-fill" style={{ scaleX: fill }} />
            {milestones.map((ms, i) => (
              <button
                type="button"
                key={ms.id}
                className={`jd-year${i === active ? " on" : ""}`}
                tabIndex={-1}
              >
                {ms.year}
              </button>
            ))}
          </div>

          <div className="jd-main">
            {/* one centred column: section header + active milestone */}
            <div className="jd-text">
              <p className="sec-eyebrow">{"// my journey"}</p>
              <h2 className="jd-heading">Born to build</h2>
              <p className="jd-lede">
                A scroll-driven deck of milestones — first steps to first automations,
                editable any time from the admin panel.
              </p>
              <span className="jd-divider" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="tl-year">
                    {m.icon} {m.year}
                  </span>
                  <h3 className="jd-title">{m.title}</h3>
                  <p className="jd-story">{m.story}</p>
                </motion.div>
              </AnimatePresence>
              <div className="jd-meter" aria-hidden="true">
                <motion.i style={{ width: pctWidth }} />
              </div>
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
                    className="jd-card gold-ring"
                    style={{ zIndex: n - Math.abs(off) }}
                    initial={false}
                    animate={
                      gone
                        ? { x: -420, y: -48, rotate: -24, opacity: 0, scale: 0.9 }
                        : {
                            x: off * 16,
                            y: off * 20,
                            rotate: off * 3.4,
                            opacity: off > 3 ? 0 : 1 - off * 0.12,
                            scale: 1 - off * 0.045,
                          }
                    }
                    transition={{ type: "spring", stiffness: 210, damping: 24 }}
                  >
                    {ms.image ? (
                      <div className="jd-photo">
                        <Image
                          src={ms.image}
                          alt={ms.title}
                          width={520}
                          height={390}
                          sizes="(max-width: 900px) 84vw, 540px"
                          style={{ width: "100%", height: "100%" }}
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
    </div>
  );
}
