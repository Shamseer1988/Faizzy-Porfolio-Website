import Image from "next/image";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import HeroScene, { type HeroCardData } from "@/components/HeroScene";
import RevealInit from "@/components/RevealInit";
import LiveClock from "@/components/LiveClock";
import ContactForm from "@/components/ContactForm";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Parallax from "@/components/Parallax";
import ScrollStory, { type StoryChapter } from "@/components/ScrollStory";
import Timeline from "@/components/Timeline";
import FloatingFx from "@/components/FloatingFx";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

const famAccents = ["", "lime", "amber", ""];

const storyChapters: StoryChapter[] = [
  {
    src: "/images/hero.jpg",
    alt: "Zohan in his circuit-board t-shirt",
    eyebrow: "chapter 01 · the builder",
    title: "Code, robots & a smart home",
    text: "Most kids watch the future — I build it. From programming AI-powered robots that respond to voice commands, to wiring up smart automations that control every light and sensor in Sidra House through Home Assistant and Tuya, my evenings are a maker lab in full swing. Baba and I pair-program real apps with Next.js — this very website is one of them.",
    chips: ["🤖 AI Robots", "🏠 Home Assistant", "🔌 Tuya", "💻 Next.js", "🧠 Machine Learning", "⚙️ Automation"],
    focus: "50% 22%",
  },
  {
    src: "/images/scooter.jpg",
    alt: "Young Zohan riding his green scooter",
    eyebrow: "chapter 02 · speed mode",
    title: "On wheels since day one",
    text: "Before the keyboard there were wheels. Scooters, skates, cycles — if it rolls, I ride it. My first scooter trick happened before I could write my name. Top speed is a work in progress, but the grin has been permanent since day one. The neighbourhood knows me as the kid who never walks when he can ride.",
    chips: ["🛹 Skating", "🚴 Cycling", "⚡ Full speed", "🛴 Scooter tricks", "🌪️ Street runs"],
  },
  {
    src: "/images/awesome.jpg",
    alt: "Young Zohan in his Awesome Bro t-shirt",
    eyebrow: "chapter 03 · game on",
    title: "Certified awesome bro",
    text: "Football every evening, legends on the wall, friends on speed dial. The pitch is my second screen — where bugs are tackles and deploys are goals. One day my robot will take penalty kicks for me, but until that firmware update drops, I take them myself. Big-league dreams start with small-field hustle.",
    chips: ["⚽ Football", "🌟 Big-league dreams", "🎈 Friends", "🏆 Weekend matches", "🎮 Gaming"],
  },
  {
    src: "/images/family.jpg",
    alt: "Zohan with his sister Amina Zahra and brother Nooh",
    eyebrow: "chapter 04 · the crew",
    title: "Team Sidra House",
    text: "Every maker needs a crew — and mine is world class. Amina runs the style department and keeps the lab looking sharp. Nooh is the assistant who tests every prototype first. Umma keeps the whole operation running smoothly, and Baba is the lead engineer-slash-coach behind every project. Together, we are Team Sidra House.",
    chips: ["👧 Amina Zahra", "👦 Nooh", "👨‍💻 Baba", "👩 Umma", "🏡 Sidra House", "💪 Teamwork"],
    focus: "68% 22%",
  },
];

export default async function Home() {
  const { profile, skills, hobbies, projects, family, gallery, milestones } =
    await getSiteContent();

  // Hero floating cards: his portrait + gallery photos (both editable from
  // the admin panel — swap gallery items to change the hero scene).
  const heroCards: HeroCardData[] = [
    { src: "/images/hero.jpg", caption: "That's me ✌" },
    ...gallery.slice(0, 3).map((g) => ({ src: g.src, caption: g.caption })),
  ].slice(0, 4);

  return (
    <>
      <RevealInit />
      <SmoothScroll />
      <ScrollProgress />
      <FloatingFx />
      <Nav />
      <HeroScene
        bigWord={profile.displayHighlight}
        fullName={profile.fullName}
        roles={profile.roles}
        house={profile.house}
        school={profile.school.split(",")[0]}
        className={profile.className}
        age={profile.age}
        statusTag={profile.statusTag}
        cards={heroCards}
      />
      <main className="wrap">
        <Marquee />

        {/* SCROLL STORY — pinned chapters, 3D image carousel, flying football */}
        <ScrollStory chapters={storyChapters} />

        {/* ABOUT */}
        <section id="about">
          <span className="sec-mark" aria-hidden="true">ABOUT</span>
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

        {/* LIFE TIMELINE — dynamic milestones from the admin backend */}
        <section id="journey">
          <span className="sec-mark" aria-hidden="true">JOURNEY</span>
          <p className="sec-eyebrow rv">{"// my journey"}</p>
          <h2 className="sec-title rv">Born to build</h2>
          <p className="sec-sub rv">
            Keep scrolling — the deck flips through the years, from first steps to first
            automations. (Baba adds new chapters from the admin panel as they happen.)
          </p>
          <Timeline milestones={milestones} />
        </section>

        {/* SKILLS */}
        <section id="skills">
          <span className="sec-mark" aria-hidden="true">SKILLS</span>
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
          <span className="sec-mark" aria-hidden="true">BUILDS</span>
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
          <span className="sec-mark" aria-hidden="true">FAIZZY</span>
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
          <span className="sec-mark" aria-hidden="true">CREW</span>
          <p className="sec-eyebrow rv">{"// my crew"}</p>
          <h2 className="sec-title rv">Team Sidra House</h2>
          <p className="sec-sub rv">Every maker needs a crew. Mine lives with me.</p>
          <div className="family-grid">
            <Parallax amount={26}>
              <figure className="family-photo gold-ring rv" style={{ height: "100%" }}>
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
          <span className="sec-mark" aria-hidden="true">2014</span>
          <p className="sec-eyebrow rv">{"// throwback"}</p>
          <h2 className="sec-title rv">Loading… since 2014</h2>
          <p className="sec-sub rv">Proof that the need for speed started early.</p>
          <div className="gal">
            {gallery.map((g, i) => (
              <Parallax amount={i % 2 ? 46 : 22} key={g.id}>
                <figure className={`pola gold-ring rv${i % 2 ? " d1" : ""}`}>
                  <Image src={g.src} alt={g.caption} width={800} height={1000} />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              </Parallax>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <span className="sec-mark" aria-hidden="true">HELLO</span>
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
