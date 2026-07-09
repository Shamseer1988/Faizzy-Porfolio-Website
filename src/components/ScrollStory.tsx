"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
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

/* Paragraph reveal: sentences fade-slide in one by one */
function ParagraphReveal({ text, className }: { text: string; className?: string }) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return (
    <span className={className}>
      {sentences.map((sentence, i) => (
        <motion.span
          key={i}
          style={{ display: "inline" }}
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.22 + i * 0.12,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {sentence}{" "}
        </motion.span>
      ))}
    </span>
  );
}

// Pinned scrollytelling with snap-to-chapter scrolling:
// One mouse wheel tick = one chapter change. Images rotate in like a
// deck of cards, copy reveals word by word, football flies across.
export default function ScrollStory({ chapters }: { chapters: StoryChapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const reduce = useReducedMotion();
  const n = chapters.length;
  const cooldownRef = useRef(false);

  // Container height: each chapter maps to 100vh of scroll distance.
  // Chapter i sits at scroll progress i/(n-1), so:
  //   chapter 0 = very start (instant entry),
  //   chapter n-1 = very end (instant exit).
  const scrollHeight = n * 100; // vh

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Smooth spring for continuous animations (ball, rail fill)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
  });

  // Chapter detection: evenly spaced across full scroll range
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.max(0, Math.min(n - 1, Math.round(v * (n - 1))));
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
  });

  // ── Snap scrolling: one wheel tick = one chapter ──
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    const handleWheel = (e: WheelEvent) => {
      // Ignore tiny deltas (noise from trackpads)
      if (Math.abs(e.deltaY) < 4) return;

      // Only intercept when the sticky is actually pinned
      const rect = el.getBoundingClientRect();
      const isPinned = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isPinned) return;

      const current = activeRef.current;
      const direction = e.deltaY > 0 ? 1 : -1;
      const next = current + direction;

      // At boundaries → don't intercept, let user scroll out of section
      if (next < 0 || next >= n) return;

      // Block native scroll
      e.preventDefault();

      // Skip if we're still animating from the last snap
      if (cooldownRef.current) return;
      cooldownRef.current = true;

      // Target scroll position for chapter `next`
      const storyTopAbs = window.scrollY + rect.top;
      const scrollableDistance = el.offsetHeight - window.innerHeight;
      const targetProgress = next / (n - 1);
      const targetScroll = storyTopAbs + targetProgress * scrollableDistance;

      // Use Lenis for buttery-smooth animated scroll
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }

      // Cooldown: prevent rapid-fire chapter changes
      setTimeout(() => {
        cooldownRef.current = false;
      }, 900);
    };

    // passive: false required to call preventDefault
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [n, reduce]);

  // football long-pass: bottom-right → top-left with arc + spin
  const ballX = useTransform(smoothProgress, [0.04, 0.96], ["46vw", "-46vw"]);
  const ballY = useTransform(smoothProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - 0.04) / 0.92));
    return `${34 - 68 * t - Math.sin(t * Math.PI) * 16}vh`;
  });
  const ballRotate = useTransform(smoothProgress, [0, 1], [0, -900]);
  const ballScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1.2, 0.7]);

  // hover tilt + glare on the photo stage
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const tiltX = useSpring(useTransform(hy, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 26 });
  const tiltY = useSpring(useTransform(hx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 26 });
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
    <div className="story-outer" id="story" ref={ref} style={{ height: `${scrollHeight}vh` }}>
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>

        {/* flying football — with scale pulse */}
        <motion.span
          className="story-ball"
          style={{ x: ballX, y: ballY, rotate: ballRotate, scale: ballScale }}
          aria-hidden="true"
        >
          ⚽
        </motion.span>

        {/* section header */}
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
          <motion.i className="story-rail-fill" style={{ scaleY: smoothProgress }} />
        </div>

        <div className="story-grid">
          {/* left: copy with word-by-word reveal + sentence-staggered paragraph */}
          <div className="story-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  className="sec-eyebrow story-eyebrow-anim"
                  initial={{ opacity: 0, x: -26, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45 }}
                >
                  {chapter.eyebrow}
                </motion.p>
                <h3 className="story-title">
                  <WordReveal text={chapter.title} />
                </h3>
                <p className="story-text">
                  <ParagraphReveal text={chapter.text} />
                </p>
                {/* Decorative accent line */}
                <motion.div
                  className="story-accent-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="chips" style={{ marginTop: 20 }}>
                  {chapter.chips.map((chip, ci) => (
                    <motion.span
                      className="chip"
                      key={chip}
                      initial={{ opacity: 0, scale: 0.5, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: 0.35 + ci * 0.08,
                        type: "spring",
                        stiffness: 280,
                        damping: 20,
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
            style={{ height: "var(--story-stage-height, min(74vh, 700px))" }}
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
                        ? { opacity: 0, x: -120, rotateY: -30, scale: 0.9, z: -60 }
                        : {
                            opacity: rel > 2 ? 0 : 1 - rel * 0.25,
                            x: behind * 40,
                            rotateY: behind * 10,
                            scale: 1 - behind * 0.05,
                            z: behind * -90,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 24,
                      mass: 1,
                      restDelta: 0.001,
                    }}
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
