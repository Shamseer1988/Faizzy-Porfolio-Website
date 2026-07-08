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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="bg-fx" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <CursorFx />
        {children}
      </body>
    </html>
  );
}
