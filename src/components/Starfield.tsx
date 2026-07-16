// Deterministic twinkling starfield for the site-wide background (same
// seed every render, so no hydration mismatch even though this now
// renders from a client component).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(7122026);
const bgStars = Array.from({ length: 46 }, () => ({
  left: rnd() * 100,
  top: rnd() * 100,
  size: 1 + rnd() * 2,
  delay: rnd() * 4,
}));

export default function Starfield() {
  return (
    <div className="bg-fx" aria-hidden="true">
      {bgStars.map((s, i) => (
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
    </div>
  );
}
