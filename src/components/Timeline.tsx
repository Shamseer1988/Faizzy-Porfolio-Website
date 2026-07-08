"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import type { MilestoneContent } from "@/lib/defaults";

function TimelineItem({ m, index }: { m: MilestoneContent; index: number }) {
  const left = index % 2 === 0;
  const reduce = useReducedMotion();

  return (
    <div className={`tl-item ${left ? "tl-left" : "tl-right"}`}>
      <motion.div
        className="card tl-card"
        initial={reduce ? false : { opacity: 0, y: 70, rotate: left ? -5 : 5, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ type: "spring", stiffness: 110, damping: 15 }}
      >
        {m.image && (
          <motion.div
            className="tl-photo"
            initial={reduce ? false : { scale: 1.18 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={m.image}
              alt={m.title}
              fill
              sizes="(max-width: 820px) 88vw, 460px"
            />
          </motion.div>
        )}
        <span className="tl-year">{m.year}</span>
        <h3>{m.title}</h3>
        <p>{m.story}</p>
      </motion.div>

      <motion.span
        className="tl-dot"
        initial={reduce ? false : { scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 320, damping: 13, delay: 0.1 }}
        aria-hidden="true"
      >
        {m.icon}
      </motion.span>
    </div>
  );
}

// "Born to build" life timeline: a gradient spine draws itself as you
// scroll while milestone cards spring in from alternating sides.
export default function Timeline({ milestones }: { milestones: MilestoneContent[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div className="tl" ref={ref}>
      <div className="tl-track" aria-hidden="true">
        <motion.div className="tl-line" style={{ scaleY: lineScale }} />
      </div>
      {milestones.map((m, i) => (
        <TimelineItem key={m.id} m={m} index={i} />
      ))}
    </div>
  );
}
