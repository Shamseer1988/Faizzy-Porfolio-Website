import type { Metadata } from "next";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import CursorFx from "@/components/CursorFx";
import CardFx from "@/components/CardFx";
import CinematicBg from "@/components/CinematicBg";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammed Zohan Faizzy — Young Coder, AI Robot Builder & Footballer",
    template: "%s · Zohan Faizzy",
  },
  description:
    "Portfolio of Muhammed Zohan Faizzy — an 11-year-old maker from Koyilandy, Kerala. AI robotics, smart-home projects with Home Assistant & Tuya, coding, football, skating and the Faizzy World YouTube channel.",
  keywords: [
    "Zohan Faizzy",
    "young coder",
    "kid developer",
    "AI robotics",
    "smart home",
    "Home Assistant",
    "Tuya",
    "Faizzy World",
    "Koyilandy",
  ],
  openGraph: {
    title: "Muhammed Zohan Faizzy — Young Maker Portfolio",
    description:
      "11-year-old coder, AI robot builder, smart-home captain and footballer from Kerala.",
    url: siteUrl,
    siteName: "Zohan Faizzy",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammed Zohan Faizzy — Young Maker Portfolio",
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("zohan-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

// Deterministic starfield for the site-wide background (same seed on
// server and client, so no hydration mismatch).
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
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
        <CinematicBg />
        <CursorFx />
        <CardFx />
        {children}
      </body>
    </html>
  );
}
