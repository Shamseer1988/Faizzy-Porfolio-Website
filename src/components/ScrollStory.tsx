"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export type StoryChapter = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  chips: string[];
  /** CSS object-position for the photo inside the tall frame */
  focus?: string;
};

function WordReveal({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span className="story-w-mask" key={i}>
          <motion.span
            className="story-w"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08 + i * 0.055, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </span>
  );
}

// Pinned scrollytelling with a 3D photo carousel: chapters swap in place
// against scroll — images rotate in like a deck of Figma frames, the copy
// reveals word by word, and a football flies across the pinned scene from
// bottom-right to top-left like a long pass.
export default function ScrollStory({ chapters }: { chapters: StoryChapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const n = chapters.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.max(0, Math.min(n - 1, Math.floor(v * n)));
    if (i !== active) setActive(i);
  });

  // football long-pass: bottom-right → top-left with an arc + spin
  const ballX = useTransform(scrollYProgress, [0.04, 0.96], ["46vw", "-46vw"]);
  const ballY = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - 0.04) / 0.92));
    return `${34 - 68 * t - Math.sin(t * Math.PI) * 16}vh`;
  });
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, -900]);

  // hover tilt + glare on the photo stage
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const tiltX = useSpring(useTransform(hy, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const tiltY = useSpring(useTransform(hx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(hx, [-0.5, 0.5], ["18%", "82%"]);
  const glareY = useTransform(hy, [-0.5, 0.5], ["12%", "88%"]);
  const [hovering, setHovering] = useState(false);

  function onStageMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    hx.set((e.clientX - r.left) / r.width - 0.5);
    hy.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onStageLeave() {
    hx.set(0);
    hy.set(0);
    setHovering(false);
  }

  const chapter = chapters[active];

  if (reduce) {
    return (
      <div className="story-static">
        {chapters.map((c) => (
          <div className="story-static-row" key={c.title}>
            <div className="story-img gold-ring on" style={{ position: "relative" }}>
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 900px) 92vw, 46vw"
                style={c.focus ? { objectPosition: c.focus } : undefined}
              />
            </div>
            <div>
              <p className="sec-eyebrow">{c.eyebrow}</p>
              <h3 className="story-title">{c.title}</h3>
              <p className="story-text">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="story-outer" id="story" ref={ref} style={{ height: `${n * 100}vh` }}>
      <div className="story-sticky">
        {/* ambient background: spotlight + giant chapter number watermark */}
        <div className="story-spot" aria-hidden="true" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            className="story-num-bg"
            initial={{ opacity: 0, scale: 1.3, rotate: 6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>

        {/* flying football */}
        <motion.span
          className="story-ball"
          style={{ x: ballX, y: ballY, rotate: ballRotate }}
          aria-hidden="true"
        >
          ⚽
        </motion.span>

        {/* section header lives inside the pinned screen — no dead gap */}
        <div className="story-head">
          <p className="sec-eyebrow">{"// my story"}</p>
          <h2 className="sec-title">Scroll through my world</h2>
        </div>

        {/* progress rail */}
        <div className="story-rail" aria-hidden="true">
          {chapters.map((c, i) => (
            <span key={c.title} className={`story-dot${i === active ? " on" : ""}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
          <motion.i className="story-rail-fill" style={{ scaleY: scrollYProgress }} />
        </div>

        <div className="story-grid">
          {/* left: copy with word-by-word reveal */}
          <div className="story-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.28 }}
              >
                <motion.p
                  className="sec-eyebrow"
                  initial={{ opacity: 0, x: -26 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {chapter.eyebrow}
                </motion.p>
                <h3 className="story-title">
                  <WordReveal text={chapter.title} />
                </h3>
                <motion.p
                  className="story-text"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {chapter.text}
                </motion.p>
                <div className="chips" style={{ marginTop: 20 }}>
                  {chapter.chips.map((chip, ci) => (
                    <motion.span
                      className="chip"
                      key={chip}
                      initial={{ opacity: 0, scale: 0.5, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.3 + ci * 0.07,
                        type: "spring",
                        stiffness: 320,
                        damping: 17,
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* right: 3D card carousel with hover tilt + glare */}
          <div
            className="story-stage"
            style={{ height: "var(--story-stage-height, min(66vh, 600px))" }}
            onMouseMove={onStageMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={onStageLeave}
          >
            <motion.div
              className="story-stage-tilt"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                rotateX: tiltX,
                rotateY: tiltY,
                scale: hovering ? 1.03 : 1,
              }}
            >
              {chapters.map((c, i) => {
                const rel = i - active;
                const behind = Math.min(Math.max(rel, -1), 3);
                return (
                  <motion.div
                    key={c.src}
                    className="story-img gold-ring"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: n - Math.abs(rel),
                    }}
                    initial={false}
                    animate={
                      rel < 0
                        ? { opacity: 0, x: -140, rotateY: -42, scale: 0.86 }
                        : {
                            opacity: rel > 2 ? 0 : 1 - rel * 0.28,
                            x: behind * 42,
                            rotateY: behind * 13,
                            scale: 1 - behind * 0.07,
                          }
                    }
                    transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  >
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 900px) 92vw, 46vw"
                      priority={i === 0}
                      style={c.focus ? { objectPosition: c.focus } : undefined}
                    />
                    {i === active && (
                      <motion.span className="story-glare" style={{ left: glareX, top: glareY }} />
                    )}
                  </motion.div>
                );
              })}
              <div className="story-counter" aria-hidden="true">
                {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
