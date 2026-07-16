"use client";

import { useEffect, useRef, useState } from "react";

export default function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (roles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setVisible(false);
      timers.current.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % roles.length);
          setVisible(true);
        }, 240),
      );
    }, 2600);
    const pending = timers.current;
    return () => {
      clearInterval(id);
      pending.forEach(clearTimeout);
    };
  }, [roles.length]);

  return (
    <div className="roles">
      I&apos;m a&nbsp;
      <span className="word" style={{ opacity: visible ? 1 : 0 }}>
        {roles[index] ?? ""}
      </span>
    </div>
  );
}
