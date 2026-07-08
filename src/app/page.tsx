import Image from "next/image";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import TiltCard from "@/components/TiltCard";
import RoleRotator from "@/components/RoleRotator";
import RevealInit from "@/components/RevealInit";
import LiveClock from "@/components/LiveClock";
import ContactForm from "@/components/ContactForm";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import HeroFx from "@/components/HeroFx";
import Parallax from "@/components/Parallax";
import ScrollStory, { type StoryChapter } from "@/components/ScrollStory";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

const famAccents = ["", "lime", "amber", ""];

const storyChapters: StoryChapter[] = [
  {
    src: "/images/hero.jpg",
    alt: "Zohan in his circuit-board t-shirt",
    eyebrow: "chapter 01 · the builder",
    title: "Code, robots & a smart home",
    text: "Most kids watch the future — I build it. AI robot experiments, automations that run Sidra House with Home Assistant and Tuya, and apps made side-by-side with Baba.",
    chips: ["🤖 AI Robots", "🏠 Home Assistant", "🔌 Tuya", "💻 Next.js"],
  },
  {
    src: "/images/scooter.jpg",
    alt: "Young Zohan riding his green scooter",
    eyebrow: "chapter 02 · speed mode",
    title: "On wheels since day one",
    text: "Before the keyboard there were wheels. Scooters, skates, cycles — if it rolls, I ride it. Top speed is a work in progress; the grin is permanent.",
    chips: ["🛹 Skating", "🚴 Cycling", "⚡ Full speed"],
  },
  {
    src: "/images/awesome.jpg",
    alt: "Young Zohan in his Awesome Bro t-shirt",
    eyebrow: "chapter 03 · game on",
    title: "Certified awesome bro",
    text: "Football every evening, legends on the wall, friends on speed dial. One day my robot will take penalty kicks — until then, I take them myself.",
    chips: ["⚽ Football", "🌟 Big-league dreams", "🎈 Friends"],
  },
  {
    src: "/images/family.jpg",
    alt: "Zohan with his sister Amina Zahra and brother Nooh",
    eyebrow: "chapter 04 · the crew",
    title: "Team Sidra House",
    text: "Every maker needs a crew. Amina runs the style department, Nooh assists in the lab, Umma runs everything, and Baba is the coach behind every project.",
    chips: ["👧 Amina Zahra", "👦 Nooh", "👨‍💻 Baba", "👩 Umma"],
    focus: "68% 22%",
  },
];

export default async function Home() {
  const { profile, skills, hobbies, projects, family, gallery } =
    await getSiteContent();

  return (
    <>
      <RevealInit />
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      <main className="wrap" id="top">
        {/* HERO */}
        <HeroFx
          left={
            <div>
            <span className="eyebrow rv in">
              <span className="dot" />
              Hello world — I&apos;m building things
            </span>
            <h1>
              {profile.displayFirst} <span className="grad">{profile.displayHighlight}</span>{" "}
              {profile.displayLast}
            </h1>
            <RoleRotator roles={profile.roles} />
            <p className="hero-sub">
              {profile.age}-year-old maker from <b>{profile.house}</b> — Class{" "}
              {profile.className} at <b>{profile.school}</b>. I build <b>AI robots</b>, run
              our <b>smart home</b>, score goals ⚽ and make videos for my channel{" "}
              <b>Faizzy World</b>.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/resume" target="_blank">
                ⬇ Download Resume
              </a>
              <a className="btn btn-ghost" href="#contact">
                👋 Say Hello
              </a>
            </div>
            <div className="stat-row">
              <div className="stat">
                <b data-count={profile.age}>0</b>
                <span>Years old</span>
              </div>
              <div className="stat">
                <b>
                  {profile.className}
                  <i style={{ fontStyle: "normal", fontSize: 14 }}>th</i>
                </b>
                <span>Class</span>
              </div>
              <div className="stat">
                <b data-count={profile.projectsCount}>0</b>
                <span>Projects</span>
              </div>
              <div className="stat">
                <b>∞</b>
                <span>Ideas</span>
              </div>
            </div>
          </div>
          }
          right={
            <TiltCard>
              <figure className="photo-frame">
                <Image
                  src="/images/hero.jpg"
                  alt={`${profile.fullName} sitting on a designer chair in his circuit-board t-shirt`}
                  width={747}
                  height={1280}
                  priority
                />
              </figure>
              <span className="orbit o1">⚽</span>
              <span className="orbit o2">🤖</span>
              <span className="orbit o3">🛹</span>
              <span className="orbit o4">💡</span>
              <span className="hero-tag">
                ⚡ Status: <span className="lv">{profile.statusTag}</span>
              </span>
            </TiltCard>
          }
        />

        <Marquee />

        {/* SCROLL STORY — pinned chapters, images & copy swap with scroll */}
        <section id="story" style={{ paddingBottom: 0 }}>
          <p className="sec-eyebrow rv">{"// my story"}</p>
          <h2 className="sec-title rv">Scroll through my world</h2>
          <p className="sec-sub rv">
            Keep scrolling — the pictures and the story move with you.
          </p>
        </section>
        <ScrollStory chapters={storyChapters} />

        {/* ABOUT */}
        <section id="about">
          <p className="sec-eyebrow rv">{"// about me"}</p>
          <h2 className="sec-title rv">Player one, ready</h2>
          <p className="sec-sub rv">
            School by day, maker-lab by evening. Here&apos;s my world at a glance — and yes,
            the clock is live.
          </p>
          <div className="bento">
            <div className="card rv">
              <div className="ic">🎓</div>
              <h3>{profile.school.split(",")[0]}</h3>
              <p>
                Class {profile.className} · {profile.school.split(",").slice(1).join(",").trim() || "Koyilandy"}.
                Favourite period? Anything with a screen or a ball.
              </p>
            </div>
            <div className="card rv d1">
              <div className="ic lime">🏡</div>
              <h3>{profile.house}</h3>
              <p>
                Home base — and my <b>smart-home playground</b> with lights, sensors and
                automations.
              </p>
            </div>
            <LiveClock variant="card" />
            <div className="card rv span2">
              <div className="ic amber">🧠</div>
              <h3>Learning from Baba&apos;s playbook</h3>
              <p>
                My dad builds apps — and I&apos;m learning it all: <b>app creation with
                Next.js</b>, <b>AI projects</b>, <b>Home Assistant</b>, <b>Tuya device
                development</b> and electronics. Apprentice today, lead engineer of Sidra
                House tomorrow.
              </p>
            </div>
            <div className="card rv d1">
              <div className="ic">⚽</div>
              <h3>Football fan-boy</h3>
              <p>Big fan of the legends. Dream: build a robot that can take penalty kicks.</p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <p className="sec-eyebrow rv">{"// skills"}</p>
          <h2 className="sec-title rv">Maker lab &amp; play mode</h2>
          <p className="sec-sub rv">
            Two sides of every day: what I&apos;m learning to build, and how I recharge.
          </p>
          <div className="skills-grid">
            <div className="card rv">
              <h3 style={{ marginBottom: 20 }}>🔧 Maker lab</h3>
              {skills.map((s) => (
                <div className="bar-row" key={s.id}>
                  <div className="bar-head">
                    <span>{s.name}</span>
                    <span>{s.percent}%</span>
                  </div>
                  <div className="bar">
                    <i data-w={`${s.percent}%`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="card rv d1">
              <h3 style={{ marginBottom: 20 }}>🎮 Play mode</h3>
              <div className="chips">
                {hobbies.map((h) => (
                  <span className="chip" key={h.id}>
                    {h.label}
                  </span>
                ))}
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 22 }}>
                Rule of the house: finish homework → open the maker lab → football before
                sunset.
              </p>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <p className="sec-eyebrow rv">{"// projects"}</p>
          <h2 className="sec-title rv">Things I&apos;m building</h2>
          <p className="sec-sub rv">
            Real experiments from the Sidra House lab — with Baba as co-pilot.
          </p>
          <div className="proj-grid">
            {projects.map((p, i) => (
              <div className={`card proj rv${i % 4 ? ` d${i % 4}` : ""}`} key={p.id}>
                <span className={`tag ${p.accent}`}>{p.tag}</span>
                <div className={`ic ${p.accent === "cyan" ? "" : p.accent}`}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="tools">
                  {p.tools.map((t) => (
                    <i key={t}>{t}</i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* YOUTUBE */}
        <section id="youtube">
          <p className="sec-eyebrow rv" style={{ color: "var(--yt)" }}>
            {"// creator zone"}
          </p>
          <h2 className="sec-title rv">Faizzy World 🎬</h2>
          <p className="sec-sub rv">
            My own YouTube channel — next season powered by AI-generated videos.
          </p>
          <div className="yt-band rv">
            <div>
              <span className="yt-logo">▶</span>
              <h3>youtube.com/{profile.youtubeHandle}</h3>
              <p>
                Robots, smart-home tours, football tricks and experiments — created by me,
                supercharged with AI video tools.
              </p>
              <div className="yt-progress">
                <span>Next upload</span>
                <div className="bar">
                  <i />
                </div>
                <span>rendering…</span>
              </div>
            </div>
            <a className="btn btn-yt" href={profile.youtubeUrl} target="_blank" rel="noopener">
              ▶ Visit my channel
            </a>
          </div>
        </section>

        {/* FAMILY */}
        <section id="family">
          <p className="sec-eyebrow rv">{"// my crew"}</p>
          <h2 className="sec-title rv">Team Sidra House</h2>
          <p className="sec-sub rv">Every maker needs a crew. Mine lives with me.</p>
          <div className="family-grid">
            <Parallax amount={26}>
              <figure className="family-photo rv" style={{ height: "100%" }}>
                <Image
                  src="/images/family.jpg"
                  alt="Zohan with his sister Amina Zahra and brother Nooh"
                  width={747}
                  height={560}
                />
                <figcaption>Amina · Nooh · Zohan — squad complete ✔</figcaption>
              </figure>
            </Parallax>
            <div className="fam-list">
              {family.map((f, i) => (
                <div className={`card fam-item rv${i ? ` d${Math.min(i, 3)}` : ""}`} key={f.id}>
                  <span className={`av ${famAccents[i % famAccents.length]}`}>{f.emoji}</span>
                  <div>
                    <b>{f.name}</b>
                    <span>{f.relation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery">
          <p className="sec-eyebrow rv">{"// throwback"}</p>
          <h2 className="sec-title rv">Loading… since 2014</h2>
          <p className="sec-sub rv">Proof that the need for speed started early.</p>
          <div className="gal">
            {gallery.map((g, i) => (
              <Parallax amount={i % 2 ? 46 : 22} key={g.id}>
                <figure className={`pola rv${i % 2 ? " d1" : ""}`}>
                  <Image src={g.src} alt={g.caption} width={800} height={1000} />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              </Parallax>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <p className="sec-eyebrow rv">{"// contact"}</p>
          <h2 className="sec-title rv">Send a message to mission control</h2>
          <p className="sec-sub rv">
            Messages land in the family admin inbox — Baba reads everything first. 📬
          </p>
          <div className="contact-grid">
            <ContactForm />
            <div
              className="card rv d1"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <div>
                <h3>📄 Resume</h3>
                <p style={{ color: "var(--muted)", fontSize: 14.5, margin: "6px 0 12px" }}>
                  One-page resume with school, skills and projects — always up to date with
                  the site&apos;s live data.
                </p>
                <a className="btn btn-ghost" href="/resume" target="_blank">
                  ⬇ Download PDF
                </a>
              </div>
              <div>
                <h3>🎬 Faizzy World</h3>
                <p style={{ color: "var(--muted)", fontSize: 14.5, margin: "6px 0 0" }}>
                  Prefer video? Subscribe on{" "}
                  <a href={profile.youtubeUrl} target="_blank" rel="noopener">
                    YouTube
                  </a>{" "}
                  — AI-generated uploads coming soon.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          © {new Date().getFullYear()} <b>{profile.fullName}</b> · {profile.house}
          <br />
          Built with <span className="heart">❤</span> by Baba &amp; Zohan · Next.js ×
          TypeScript × PostgreSQL · <a href="/admin">Admin</a>
        </div>
      </footer>
    </>
  );
}
