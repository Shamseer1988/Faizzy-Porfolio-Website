const items: [string, string][] = [
  ["⚽", "FOOTBALL"],
  ["💻", "CODING"],
  ["🤖", "AI ROBOTS"],
  ["🛹", "SKATING"],
  ["🚴", "CYCLING"],
  ["🏠", "SMART HOME"],
  ["🎬", "FAIZZY WORLD"],
  ["🎈", "FUN WITH FRIENDS"],
];

export default function Marquee() {
  // Content is doubled so the CSS -50% translate loops seamlessly.
  const track = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {track.map(([icon, label], i) => (
          <span key={i}>
            <i>{icon}</i>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
