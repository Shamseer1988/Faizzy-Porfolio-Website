"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import RoleRotator from "./RoleRotator";

export type HeroCardData = { src: string; caption: string };

type Props = {
  bigWord: string;
  fullName: string;
  roles: string[];
  house: string;
  school: string;
  className: string;
  age: number;
  statusTag: string;
  cards: HeroCardData[];
};

// Deterministic pseudo-random (same on server & client → no hydration mismatch).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CARD_SLOTS = [
  { top: "24%", right: "7%", w: 290, rot: 4, depth: 34, z: 4, float: 0 },
  { top: "10%", left: "5%", w: 185, rot: -7, depth: 20, z: 3, float: 1.1 },
  { top: "56%", right: "31%", w: 155, rot: 6, depth: 14, z: 1, float: 2.2 },
  { top: "12%", left: "33%", w: 150, rot: -4, depth: 26, z: 1, float: 0.6 },
];

function Layer({
  mx,
  my,
  depth,
  children,
  className,
  style,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth * 0.6);
  return (
    <motion.div className={className} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  );
}

// Full-viewport illustrated-parallax hero: giant display word, floating
// photo cards at different depths (mouse + scroll parallax), twinkling
// sky and rolling foreground hills.
export default function HeroScene({
  bigWord,
  fullName,
  roles,
  house,
  school,
  className,
  age,
  statusTag,
  cards,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Remount the gradient word on theme change — Chromium can drop the paint
  // of background-clip:text elements when CSS variables swap live.
  const [wordKey, setWordKey] = useState(0);
  useEffect(() => {
    const bump = () => setWordKey((k) => k + 1);
    window.addEventListener("zohan-themechange", bump);
    return () => window.removeEventListener("zohan-themechange", bump);
  }, []);

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ySky = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yWord = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const yCardsSlow = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yCardsFast = useTransform(scrollYProgress, [0, 1], [0, -190]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // mouse parallax (springed, in [-1, 1])
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const r = (ref.current as HTMLElement).getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }

  const stars = useMemo(() => {
    const rnd = mulberry32(20141207);
    return Array.from({ length: 42 }, () => ({
      left: rnd() * 100,
      top: rnd() * 62,
      size: 1 + rnd() * 2.2,
      delay: rnd() * 4,
    }));
  }, []);

  const slots = CARD_SLOTS.slice(0, Math.min(cards.length, CARD_SLOTS.length));

  return (
    <motion.section
      className="hz"
      id="top"
      ref={ref}
      onMouseMove={onMove}
      style={reduce ? undefined : { opacity: sceneOpacity }}
    >
      {/* sky */}
      <motion.div className="hz-sky" style={reduce ? undefined : { y: ySky }} aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="hz-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        <span className="hz-cloud c1" />
        <span className="hz-cloud c2" />
        <span className="hz-cloud c3" />
      </motion.div>

      {/* giant word */}
      <motion.div
        key={wordKey}
        className="hz-word"
        style={reduce ? undefined : { y: yWord, opacity: wordOpacity }}
        aria-hidden="true"
      >
        {/* gradient + background-clip must live on the SAME element as the
            mouse-parallax transform, or Chromium drops the text paint */}
        <Layer mx={mx} my={my} depth={10} className="hz-word-text">
          {bigWord.toUpperCase()}
        </Layer>
      </motion.div>

      {/* floating photo cards */}
      {slots.map((slot, i) => {
        const card = cards[i];
        return (
          <motion.div
            key={card.src + i}
            className={`hz-cardpos hz-slot-${i}`}
            style={{
              top: slot.top,
              left: slot.left,
              right: slot.right,
              width: slot.w,
              zIndex: slot.z,
              y: reduce ? undefined : slot.depth > 24 ? yCardsFast : yCardsSlow,
            }}
          >
            <Layer mx={mx} my={my} depth={slot.depth}>
              <motion.figure
                className="hz-card"
                style={{ rotate: slot.rot }}
                initial={reduce ? false : { opacity: 0, y: 60, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.15 * i }}
              >
                <span
                  className="hz-card-inner"
                  style={reduce ? undefined : { animationDelay: `${slot.float}s` }}
                >
                  <Image
                    src={card.src}
                    alt={card.caption}
                    width={slot.w}
                    height={Math.round(slot.w * 1.2)}
                    priority={i === 0}
                  />
                  <figcaption>{card.caption}</figcaption>
                </span>
              </motion.figure>
            </Layer>
          </motion.div>
        );
      })}

      {/* copy block */}
      <motion.div className="hz-copy" style={reduce ? undefined : { y: yCopy }}>
        <span className="eyebrow">
          <span className="dot" />
          Hello world — I&apos;m building things
        </span>
        <h1>{fullName}</h1>
        <RoleRotator roles={roles} />
        <p>
          {age}-year-old maker from <b>{house}</b> · Class {className}, {school}. Status:{" "}
          <b style={{ color: "var(--lime)" }}>{statusTag}</b>
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/resume" target="_blank">
            ⬇ Download Resume
          </a>
          <a className="btn btn-ghost" href="#contact">
            👋 Say Hello
          </a>
        </div>
      </motion.div>

      {/* foreground hills */}
      <div className="hz-hills" aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path
            className="hz-hill-back"
            d="M0,120 C240,40 420,150 720,90 C1020,30 1200,130 1440,70 L1440,220 L0,220 Z"
          />
          <path
            className="hz-hill-front"
            d="M0,170 C300,110 520,200 820,150 C1120,100 1280,190 1440,140 L1440,220 L0,220 Z"
          />
        </svg>
        <span className="hz-ball">⚽</span>
      </div>

      {/* scroll hint */}
      <div className="hz-scrollhint" aria-hidden="true">
        <span>scroll</span>
        <i>⌄</i>
      </div>
    </motion.section>
  );
}
