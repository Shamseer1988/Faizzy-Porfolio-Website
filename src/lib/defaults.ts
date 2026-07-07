// Default site content — used to seed the database and as a graceful
// fallback when no database is reachable (e.g. static preview builds).

export type ProfileContent = {
  fullName: string;
  displayFirst: string;
  displayHighlight: string;
  displayLast: string;
  roles: string[];
  bio: string;
  age: number;
  className: string;
  school: string;
  house: string;
  youtubeUrl: string;
  youtubeHandle: string;
  statusTag: string;
  projectsCount: number;
};

export type SkillContent = { id: number; name: string; percent: number; order: number };
export type HobbyContent = { id: number; label: string; order: number };
export type ProjectContent = {
  id: number;
  title: string;
  description: string;
  icon: string;
  tag: string;
  accent: string;
  tools: string[];
  order: number;
  visible: boolean;
};
export type FamilyMemberContent = { id: number; name: string; relation: string; emoji: string; order: number };
export type GalleryItemContent = { id: number; src: string; caption: string; order: number };

export type SiteContent = {
  profile: ProfileContent;
  skills: SkillContent[];
  hobbies: HobbyContent[];
  projects: ProjectContent[];
  family: FamilyMemberContent[];
  gallery: GalleryItemContent[];
};

export const defaultContent: SiteContent = {
  profile: {
    fullName: "Muhammed Zohan Faizzy",
    displayFirst: "Muhammed",
    displayHighlight: "Zohan",
    displayLast: "Faizzy",
    roles: [
      "Young Coder 💻",
      "AI Robot Builder 🤖",
      "Smart-Home Captain 🏠",
      "Footballer ⚽",
      "YouTuber 🎬",
      "Skater 🛹",
    ],
    bio:
      "11-year-old maker from Sidra House, Korapra — Class 7 at Markaz Public School, Koyilandy. I build AI robots, run our smart home, score goals and make videos for my channel Faizzy World.",
    age: 11,
    className: "7",
    school: "Markaz Public School, Koyilandy",
    house: "Sidra House, Korapra",
    youtubeUrl: "https://www.youtube.com/@faizzyworld3556",
    youtubeHandle: "@faizzyworld3556",
    statusTag: "building robots & big dreams",
    projectsCount: 12,
  },
  skills: [
    { id: 1, name: "Smart Home · Home Assistant & Tuya", percent: 85, order: 1 },
    { id: 2, name: "Coding & App Building", percent: 80, order: 2 },
    { id: 3, name: "AI & Robotics Projects", percent: 75, order: 3 },
    { id: 4, name: "Electronics & Circuits", percent: 70, order: 4 },
    { id: 5, name: "Video Creation (AI-powered)", percent: 65, order: 5 },
  ],
  hobbies: [
    { id: 1, label: "⚽ Football", order: 1 },
    { id: 2, label: "🛹 Skating", order: 2 },
    { id: 3, label: "🚴 Cycling", order: 3 },
    { id: 4, label: "🌟 Football stars", order: 4 },
    { id: 5, label: "🎈 Friends time", order: 5 },
    { id: 6, label: "🎬 YouTube", order: 6 },
    { id: 7, label: "🤖 Robot toys", order: 7 },
    { id: 8, label: "💡 Wild ideas", order: 8 },
  ],
  projects: [
    {
      id: 1,
      title: "AI Robot Buddy",
      description:
        "A voice-controlled robot friend that answers questions and follows commands. Next milestone: making it roll to my room.",
      icon: "🤖",
      tag: "In progress",
      accent: "cyan",
      tools: ["AI", "Robotics", "Sensors"],
      order: 1,
      visible: true,
    },
    {
      id: 2,
      title: "Sidra Smart Home",
      description:
        "Lights, plugs and sensors around our house, automated with Home Assistant and Tuya — I write the automations myself.",
      icon: "🏠",
      tag: "Live at home",
      accent: "lime",
      tools: ["Home Assistant", "Tuya", "Automation"],
      order: 2,
      visible: true,
    },
    {
      id: 3,
      title: "Electronics Lab",
      description:
        "LEDs, buzzers, motors and circuit boards — learning how the hardware under every smart device actually works.",
      icon: "💡",
      tag: "Weekend lab",
      accent: "amber",
      tools: ["Circuits", "Arduino-style", "Soldering (supervised!)"],
      order: 3,
      visible: true,
    },
    {
      id: 4,
      title: "Mini App Studio",
      description:
        "Building small apps with Baba using the same tools the pros use — this very portfolio is our project together.",
      icon: "📱",
      tag: "Learning",
      accent: "cyan",
      tools: ["Next.js", "TypeScript", "PostgreSQL"],
      order: 4,
      visible: true,
    },
  ],
  family: [
    { id: 1, name: "Shamseer Makkanamchery", relation: "Father · my coding & smart-home coach", emoji: "👨‍💻", order: 1 },
    { id: 2, name: "Amalnisa Shamseer", relation: "Mother · chief of everything", emoji: "👩", order: 2 },
    { id: 3, name: "Amina Zahra Shamseer", relation: "Sister · style department", emoji: "👧", order: 3 },
    { id: 4, name: "Nooh Muhammed Shamseer", relation: "Brother · junior lab assistant", emoji: "👦", order: 4 },
  ],
  gallery: [
    { id: 1, src: "/images/scooter.jpg", caption: "Speed mode: ON 🚴", order: 1 },
    { id: 2, src: "/images/awesome.jpg", caption: "Certified Awesome Bro 😎", order: 2 },
  ],
};
