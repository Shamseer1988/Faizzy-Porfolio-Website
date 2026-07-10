"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export type GalleryItem = {
  id: number;
  src: string;
  caption: string;
  category?: string;
  year?: string;
  order: number;
};

type Props = {
  items: GalleryItem[];
};

// Enrich gallery items with year/category metadata
function enrich(items: GalleryItem[]): GalleryItem[] {
  const meta: Record<number, { year: string; category: string }> = {
    1: { year: "2019", category: "adventures" },
    2: { year: "2019", category: "life" },
    3: { year: "2026", category: "family" },
    4: { year: "2023", category: "adventures" },
    5: { year: "2021", category: "adventures" },
    6: { year: "2020", category: "adventures" },
  };
  return items.map((it) => ({
    ...it,
    year: it.year ?? meta[it.id]?.year ?? "2024",
    category: it.category ?? meta[it.id]?.category ?? "life",
  }));
}

const CATEGORIES = ["all", "family", "adventures", "life"];

export default function ThrowbackGallery({ items }: Props) {
  const enriched = enrich(items);
  const years = ["all", ...Array.from(new Set(enriched.map((i) => i.year!))).sort()];

  const [catFilter, setCatFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const filtered = enriched.filter(
    (it) =>
      (catFilter === "all" || it.category === catFilter) &&
      (yearFilter === "all" || it.year === yearFilter)
  );

  // 3D carousel state
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const velocityRef = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);
  const autoRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = Math.max(filtered.length, 1);
  const angleStep = 360 / count;
  // Radius scales with count
  const radius = Math.max(220, count * 90);

  // Auto-rotate
  const startAuto = useCallback(() => {
    cancelAnimationFrame(autoRef.current);
    const tick = () => {
      setAngle((a) => a - 0.18);
      autoRef.current = requestAnimationFrame(tick);
    };
    autoRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAuto = useCallback(() => {
    cancelAnimationFrame(autoRef.current);
  }, []);

  useEffect(() => {
    setMounted(true);
    startAuto();
    return () => {
      stopAuto();
      cancelAnimationFrame(rafRef.current);
    };
  }, [startAuto, stopAuto, filtered.length]);

  // Inertia deceleration
  const deccelerate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const step = () => {
      velocityRef.current *= 0.94;
      setAngle((a) => a + velocityRef.current);
      if (Math.abs(velocityRef.current) > 0.08) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        startAuto();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [startAuto]);

  const onPointerDown = (e: React.PointerEvent) => {
    stopAuto();
    cancelAnimationFrame(rafRef.current);
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartAngle.current = angle;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    setAngle(dragStartAngle.current + dx * 0.35);
    const dt = Date.now() - lastTime.current;
    if (dt > 0) {
      velocityRef.current = ((e.clientX - lastX.current) / dt) * 16 * 0.35;
    }
    lastX.current = e.clientX;
    lastTime.current = Date.now();
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    deccelerate();
  };

  // Which item is nearest center (angle 0)?
  function getVisualAngle(idx: number) {
    const raw = (angle + idx * angleStep) % 360;
    return ((raw % 360) + 360) % 360;
  }
  function angleDiff(a: number) {
    const d = Math.abs(a - 180);
    return d > 180 ? 360 - d : d;
  }
  function isFront(idx: number) {
    return angleDiff(getVisualAngle(idx)) < angleStep / 2;
  }

  // Open lightbox at a specific filtered index
  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightbox(filtered[idx]);
  };

  const navLightbox = (dir: number) => {
    const next = (lightboxIdx + dir + filtered.length) % filtered.length;
    setLightboxIdx(next);
    setLightbox(filtered[next]);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight" && lightbox) navLightbox(1);
      if (e.key === "ArrowLeft" && lightbox) navLightbox(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="tgal-wrapper">
      {/* ── Filters ── */}
      <div className="tgal-filters">
        <div className="tgal-filter-group">
          <span className="tgal-filter-label">📂 Category</span>
          <div className="tgal-filter-pills">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`tgal-pill ${catFilter === c ? "active" : ""}`}
                onClick={() => { setCatFilter(c); setAngle(0); }}
              >
                {c === "all" ? "✨ All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="tgal-filter-group">
          <span className="tgal-filter-label">📅 Year</span>
          <div className="tgal-filter-pills">
            {years.map((y) => (
              <button
                key={y}
                className={`tgal-pill ${yearFilter === y ? "active" : ""}`}
                onClick={() => { setYearFilter(y); setAngle(0); }}
              >
                {y === "all" ? "✨ All" : y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3D Carousel ── */}
      <div className="tgal-scene-wrap">
        {/* Ambient glow rings */}
        <div className="tgal-ring tgal-ring-1" />
        <div className="tgal-ring tgal-ring-2" />

        <div
          ref={containerRef}
          className={`tgal-scene ${isDragging ? "dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {filtered.length === 0 ? (
            <div className="tgal-empty">
              <span>🔍</span>
              <p>No photos match these filters</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              // On SSR / before mount: render cards at rest position, no dynamic styles
              const itemAngle = mounted ? (angle + idx * angleStep) % 360 : idx * angleStep;
              const rad = (itemAngle * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const z = Math.cos(rad) * radius;
              const normAngle = ((itemAngle % 360) + 360) % 360;
              const diff = angleDiff(normAngle);
              const front = isFront(idx);
              // Scale: front is biggest
              const scale = front
                ? 1.32
                : Math.max(0.68, 1 - (diff / 180) * 0.5);
              const brightness = front
                ? 1
                : Math.max(0.45, 1 - (diff / 180) * 0.7);
              const zIndex = Math.round(z + radius) + 1;

              return (
                <div
                  key={item.id}
                  className={`tgal-card ${front ? "tgal-card--front" : ""}`}
                  suppressHydrationWarning
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                    filter: `brightness(${brightness})`,
                    zIndex,
                    transition: isDragging
                      ? "none"
                      : "transform 0.12s ease-out, filter 0.12s ease-out",
                  }}
                  onClick={() => front && openLightbox(idx)}
                  title={front ? `Open: ${item.caption}` : ""}
                >
                  <div className="tgal-img-wrap">
                    <Image
                      src={item.src}
                      alt={item.caption}
                      width={320}
                      height={420}
                      className="tgal-img"
                      draggable={false}
                    />
                    {front && (
                      <div className="tgal-card-overlay">
                        <span className="tgal-open-hint">🔍 Click to open</span>
                      </div>
                    )}
                  </div>
                  <div className="tgal-caption">
                    <span>{item.caption}</span>
                    {item.year && (
                      <span className="tgal-year-badge">{item.year}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drag hint */}
        <div className="tgal-drag-hint">
          <span>← drag to rotate →</span>
        </div>

        {/* Nav arrows */}
        {filtered.length > 1 && (
          <>
            <button
              className="tgal-nav tgal-nav-l"
              onClick={() => setAngle((a) => a + angleStep)}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="tgal-nav tgal-nav-r"
              onClick={() => setAngle((a) => a - angleStep)}
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="tgal-lightbox"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
        >
          <div className="tgal-lb-inner">
            <button
              className="tgal-lb-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ✕
            </button>
            {filtered.length > 1 && (
              <button
                className="tgal-lb-arrow tgal-lb-arrow-l"
                onClick={() => navLightbox(-1)}
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}
            <div className="tgal-lb-img-wrap">
              <Image
                src={lightbox.src}
                alt={lightbox.caption}
                width={900}
                height={720}
                className="tgal-lb-img"
                priority
              />
              <div className="tgal-lb-meta">
                <div className="tgal-lb-caption">{lightbox.caption}</div>
                <div className="tgal-lb-tags">
                  {lightbox.category && (
                    <span className="tgal-lb-tag tgal-lb-tag--cat">
                      📂 {lightbox.category}
                    </span>
                  )}
                  {lightbox.year && (
                    <span className="tgal-lb-tag tgal-lb-tag--year">
                      📅 {lightbox.year}
                    </span>
                  )}
                  <span className="tgal-lb-tag tgal-lb-tag--count">
                    {lightboxIdx + 1} / {filtered.length}
                  </span>
                </div>
              </div>
            </div>
            {filtered.length > 1 && (
              <button
                className="tgal-lb-arrow tgal-lb-arrow-r"
                onClick={() => navLightbox(1)}
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="tgal-lb-strip">
            {filtered.map((it, i) => (
              <button
                key={it.id}
                className={`tgal-lb-thumb ${i === lightboxIdx ? "active" : ""}`}
                onClick={() => { setLightboxIdx(i); setLightbox(filtered[i]); }}
                aria-label={it.caption}
              >
                <Image
                  src={it.src}
                  alt={it.caption}
                  width={80}
                  height={80}
                  className="tgal-lb-thumb-img"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
