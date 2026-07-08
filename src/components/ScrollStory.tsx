"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
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

// Apple-product-page scrollytelling: the section pins to the viewport for
// `chapters.length` screen-heights; scrolling crossfades the photo stack on
// one side while the copy on the other side swaps chapter by chapter.
export default function ScrollStory({ chapters }: { chapters: StoryChapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.max(0, Math.min(chapters.length - 1, Math.floor(v * chapters.length)));
    if (i !== active) setActive(i);
  });

  // Continuous micro-motion on the photo stack while the section is pinned.
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);
  const imgY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  const chapter = chapters[active];

  if (reduce) {
    // Static fallback: all chapters stacked, no pinning.
    return (
      <div className="story-static">
        {chapters.map((c) => (
          <div className="story-static-row" key={c.title}>
            <div className="story-img on" style={{ position: "relative" }}>
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
    <div className="story-outer" ref={ref} style={{ height: `${chapters.length * 100}vh` }}>
      <div className="story-sticky">
        {/* progress rail */}
        <div className="story-rail" aria-hidden="true">
          {chapters.map((c, i) => (
            <span key={c.title} className={`story-dot${i === active ? " on" : ""}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
          <motion.i className="story-rail-fill" style={{ scaleY: scrollYProgress }} />
        </div>

        {/* left: copy that changes with scroll */}
        <div className="story-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -44 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="sec-eyebrow">{chapter.eyebrow}</p>
              <h3 className="story-title">{chapter.title}</h3>
              <p className="story-text">{chapter.text}</p>
              <div className="chips" style={{ marginTop: 20 }}>
                {chapter.chips.map((chip) => (
                  <span className="chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* right: photo stack that crossfades with scroll */}
        <motion.div className="story-imgwrap" style={{ rotate: imgRotate, y: imgY }}>
          {chapters.map((c, i) => (
            <motion.div
              key={c.src}
              className="story-img"
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                scale: i === active ? 1 : 0.94,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 900px) 92vw, 46vw"
                priority={i === 0}
                style={c.focus ? { objectPosition: c.focus } : undefined}
              />
            </motion.div>
          ))}
          <div className="story-counter" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
