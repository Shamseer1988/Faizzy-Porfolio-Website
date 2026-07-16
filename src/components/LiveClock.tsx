"use client";

import { useEffect, useState } from "react";

type Props = { variant: "nav" | "card" };

export default function LiveClock({ variant }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // The clock must start after hydration to avoid a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";

  if (variant === "nav") {
    const date = now
      ? now.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
      : "…";
    return (
      <div className="clock-chip" aria-label="Current date and time">
        <span className="clock-time">{time}</span>
        <span className="clock-date">{date}</span>
      </div>
    );
  }

  const weekday = now ? now.toLocaleDateString(undefined, { weekday: "long" }) : "Today";
  const longDate = now
    ? now.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
    : "…";
  return (
    <div className="card rv live-clock-card">
      <span className="day">{weekday}</span>
      <span className="big">{time}</span>
      <p>{longDate}</p>
    </div>
  );
}
