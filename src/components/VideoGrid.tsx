"use client";

import { useState, useEffect } from "react";
import type { VideoContent } from "@/lib/defaults";

type Props = { videos: VideoContent[]; channelUrl?: string };

// Video Thumbnail URL helpers
function getThumbUrl(v: VideoContent) {
  if (v.thumbnail) return v.thumbnail;
  return `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
}
function getThumbFallback(v: VideoContent) {
  return `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
}

export default function VideoGrid({ videos, channelUrl }: Props) {
  const [centerIdx, setCenterIdx] = useState(0);
  const [activePlay, setActivePlay] = useState<VideoContent | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive layout check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cycle center video
  const setCenter = (idx: number) => {
    setCenterIdx(idx);
  };

  const nextCenter = () => {
    setCenterIdx((prev) => (prev + 1) % Math.max(videos.length, 1));
  };

  const prevCenter = () => {
    setCenterIdx((prev) => (prev - 1 + videos.length) % Math.max(videos.length, 1));
  };

  if (!videos.length) return null;

  // Center video
  const centerVideo = videos[centerIdx];

  // Orbiting videos: the rest of the videos, 2 on the left + 2 on the right
  const orbitVideos = videos
    .map((v, originalIdx) => ({ video: v, originalIdx }))
    .filter((item) => item.originalIdx !== centerIdx)
    .slice(0, 4);

  // Orbit coordinates (percentages from center of the container), kept
  // well clear of the 320px-wide center card so nothing overlaps.
  // [top%, left%]
  const orbitPositions = [
    { top: 24, left: 13, angle: -140, rot: -6 },  // Top-Left (Pos 0)
    { top: 76, left: 13, angle: -70, rot: -4 },   // Bottom-Left (Pos 1)
    { top: 24, left: 87, angle: 140, rot: 6 },    // Top-Right (Pos 2)
    { top: 76, left: 87, angle: 70, rot: 4 },     // Bottom-Right (Pos 3)
  ];

  return (
    <div className="vg-galaxy-container">
      {!isMobile ? (
        // ─── COSMIC GALAXY VIEW (Desktop & Tablet Lg) ───
        <div className="vg-galaxy-scene">
          {/* Glowing orbital ring */}
          <div className="vg-galaxy-orbit-ring" />

          {/* Dotted connector SVG */}
          <svg className="vg-galaxy-svg-connectors" viewBox="0 0 1000 600">
            <ellipse
              cx="500"
              cy="300"
              rx="370"
              ry="210"
              fill="none"
              stroke="rgba(69, 227, 255, 0.18)"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Orbiting Video Cards */}
          {orbitVideos.map((item, idx) => {
            const pos = orbitPositions[idx % orbitPositions.length];
            const fallbackSrc = getThumbFallback(item.video);

            return (
              <div
                key={item.video.id}
                className="vg-orbit-card-wrap"
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rot}deg)`,
                }}
              >
                {/* Float sticker next to card */}
                <div className={`vg-orbit-sticker-badge sticker-${idx}`}>
                  <span className="vg-sticker-icon">{item.video.sticker}</span>
                </div>

                <div
                  className="vg-orbit-card"
                  onClick={() => setCenter(item.originalIdx)}
                  title={`Click to view: ${item.video.title}`}
                >
                  <div className="vg-orbit-thumb-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getThumbUrl(item.video)}
                      alt={item.video.title}
                      className="vg-orbit-thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackSrc;
                      }}
                      draggable={false}
                    />
                    <div className="vg-orbit-play-overlay">
                      <span className="vg-mini-play">▶</span>
                    </div>
                  </div>
                  <div className="vg-orbit-info">
                    <h4>{item.video.title}</h4>
                    <div className="vg-orbit-meta">
                      <span>⏱ {item.video.duration}</span>
                      <span>•</span>
                      <span>{item.video.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ─── CENTRAL MAIN CARD ─── */}
          <div className="vg-center-card-wrap">
            {/* Float sticker next to active card */}
            <div className="vg-center-sticker-badge">
              <span className="vg-center-sticker-icon">⚽</span>
            </div>

            <div className="vg-center-card">
              <span className="vg-newest-badge">⭐ Featured</span>
              <div className="vg-center-thumb-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getThumbUrl(centerVideo)}
                  alt={centerVideo.title}
                  className="vg-center-thumb"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getThumbFallback(centerVideo);
                  }}
                  draggable={false}
                />
                {/* Central Play Button */}
                <button
                  className="vg-center-play-btn"
                  onClick={() => setActivePlay(centerVideo)}
                  aria-label={`Play video: ${centerVideo.title}`}
                >
                  <span className="vg-play-pulse-ring-1" />
                  <span className="vg-play-pulse-ring-2" />
                  <span className="vg-play-triangle">▶</span>
                </button>
              </div>

              <div className="vg-center-info">
                <h3>{centerVideo.title}</h3>
                <p className="vg-center-desc">{centerVideo.description}</p>
                <div className="vg-center-meta">
                  <span>⏱ {centerVideo.duration}</span>
                  <span>📅 {centerVideo.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ─── RESPONSIVE FALLBACK LIST (Mobile & Small Tablets) ───
        <div className="vg-mobile-list">
          {/* Main Featured Card */}
          <div className="vg-center-card vg-mobile-featured">
            <span className="vg-newest-badge">⭐ Featured</span>
            <div className="vg-center-thumb-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getThumbUrl(centerVideo)}
                alt={centerVideo.title}
                className="vg-center-thumb"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getThumbFallback(centerVideo);
                }}
                draggable={false}
              />
              <button
                className="vg-center-play-btn"
                onClick={() => setActivePlay(centerVideo)}
                aria-label={`Play: ${centerVideo.title}`}
              >
                <span className="vg-play-triangle">▶</span>
              </button>
            </div>
            <div className="vg-center-info">
              <h3>{centerVideo.title}</h3>
              <p className="vg-center-desc">{centerVideo.description}</p>
              <div className="vg-center-meta">
                <span>⏱ {centerVideo.duration}</span>
                <span>📅 {centerVideo.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* List of other videos */}
          <div className="vg-mobile-grid">
            {videos.map((video, idx) => {
              if (idx === centerIdx) return null;
              return (
                <div
                  key={video.id}
                  className="vg-mobile-row"
                  onClick={() => setCenter(idx)}
                >
                  <div className="vg-mobile-thumb-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getThumbUrl(video)}
                      alt={video.title}
                      className="vg-mobile-thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getThumbFallback(video);
                      }}
                      draggable={false}
                    />
                    <span className="vg-mobile-sticker">{video.sticker}</span>
                  </div>
                  <div className="vg-mobile-info">
                    <h4>{video.title}</h4>
                    <p>{video.category} • {video.timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── BOTTOM CONTROLS & PAGINATION ─── */}
      <div className="vg-controls-bar">
        <div className="vg-arrow-controls">
          <button className="vg-arrow-btn" onClick={prevCenter} aria-label="Previous Video">
            ‹
          </button>
          <div className="vg-page-dots">
            {videos.map((_, idx) => (
              <button
                key={idx}
                className={`vg-dot ${idx === centerIdx ? "active" : ""}`}
                onClick={() => setCenter(idx)}
                aria-label={`Go to video ${idx + 1}`}
              />
            ))}
          </div>
          <button className="vg-arrow-btn" onClick={nextCenter} aria-label="Next Video">
            ›
          </button>
        </div>

        <a
          href={channelUrl ?? "https://www.youtube.com/@faizzyworld3556"}
          target="_blank"
          rel="noopener noreferrer"
          className="vg-view-all-btn btn-primary"
        >
          <span>View All Videos</span>
          <span className="vg-btn-arrow">▶</span>
        </a>
      </div>

      {/* ─── YOUTUBE PLAYER EMBED MODAL ─── */}
      {activePlay && (
        <div className="vm-backdrop" onClick={() => setActivePlay(null)} role="dialog" aria-modal="true">
          <div className="vm-inner" onClick={(e) => e.stopPropagation()}>
            <button className="vm-close" onClick={() => setActivePlay(null)} aria-label="Close player">
              ✕
            </button>
            <div className="vm-header">
              <span className="vm-category">🎬 {activePlay.category}</span>
              <h3 className="vm-title">{activePlay.title}</h3>
              {activePlay.description && <p className="vm-desc">{activePlay.description}</p>}
            </div>
            <div className="vm-player-wrap">
              {activePlay.youtubeId ? (
                <iframe
                  className="vm-player"
                  src={`https://www.youtube.com/embed/${activePlay.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                  title={activePlay.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="vm-soon">
                  <img src={getThumbUrl(activePlay)} alt={activePlay.title} className="vm-soon-bg" />
                  <div className="vm-soon-overlay">
                    <span className="vm-soon-play">▶</span>
                    <p>New episode rendering… full video drops soon on my channel!</p>
                  </div>
                </div>
              )}
            </div>
            <div className="vm-footer">
              <a
                href={activePlay.youtubeId ? `https://www.youtube.com/watch?v=${activePlay.youtubeId}` : channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-yt"
              >
                {activePlay.youtubeId ? "▶ Open on YouTube" : "🔔 Watch on YouTube"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
