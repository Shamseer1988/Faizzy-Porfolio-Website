"use client";

import { usePathname } from "next/navigation";
import CinematicBg from "./CinematicBg";
import CursorFx from "./CursorFx";
import CardFx from "./CardFx";
import Starfield from "./Starfield";

// The admin login screen should read as a plain, static tool — no aurora
// background, cursor trail, twinkling stars or card tilt/spotlight.
export default function SiteFx() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;
  return (
    <>
      <Starfield />
      <CinematicBg />
      <CursorFx />
      <CardFx />
    </>
  );
}
