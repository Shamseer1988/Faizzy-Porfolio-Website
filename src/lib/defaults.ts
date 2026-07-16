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
export type MilestoneContent = {
  id: number;
  year: string;
  title: string;
  story: string;
  icon: string;
  image: string | null;
  order: number;
};
export type VideoContent = {
  id: number;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  timeAgo: string;
  sticker: string;
  featured: boolean;
  order: number;
};


export type SiteContent = {
  profile: ProfileContent;
  skills: SkillContent[];
  hobbies: HobbyContent[];
  projects: ProjectContent[];
  family: FamilyMemberContent[];
  gallery: GalleryItemContent[];
  milestones: MilestoneContent[];
  videos: VideoContent[];
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
      tools: ["Next.js", "TypeScript", "Cloudflare"],
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
    { id: 3, src: "/images/WhatsApp Image 2026-07-07 at 8.44.29 PM.jpeg", caption: "Team Sidra House crew out in the wild 🚗", order: 3 },
    { id: 4, src: "/images/20230427_075920.jpg", caption: "Big smiles and summer adventures ☀️", order: 4 },
    { id: 5, src: "/images/20210618_182607.jpg", caption: "Sunny days in the backyard 🌳", order: 5 },
    { id: 6, src: "/images/20200814_175509.jpg", caption: "Exploring the fields and grass 🌾", order: 6 },
  ],
  milestones: [
    {
      id: 1,
      year: "2014",
      title: "Hello, world!",
      story:
        "The journey begins — Sidra House welcomes its future chief engineer. First baby smiles in the lab.",
      icon: "👶",
      image: "/images/20190913_221517.jpg",
      order: 1,
    },
    {
      id: 2,
      year: "2019",
      title: "The Tech Toddler",
      story:
        "Curious about computers since day one. Mimicking Baba's programming sessions, discovering the desk, mouse and laptop.",
      icon: "💻",
      image: "/images/20200705_225431.jpg",
      order: 2,
    },
    {
      id: 3,
      year: "2020",
      title: "Promoted to Big Brother",
      story:
        "Welcomed baby brother Nooh to the crew. Posing together at Sidra House, expanding the maker lab staff.",
      icon: "👦",
      image: "/images/20200731_052602.jpg",
      order: 3,
    },
    {
      id: 4,
      year: "2021",
      title: "First Workspace & Classes",
      story:
        "Online school gave me my first personal study desk. Setting up my workspace, learning to type and compile simple lines.",
      icon: "🖥️",
      image: "/images/20210526_225247.jpg",
      order: 4,
    },
    {
      id: 5,
      year: "2022",
      title: "Conquering the Skateboard",
      story:
        "Safety gear on, helmet strapped, neighborhood ready. Mastered balancing and rolling on four wheels.",
      icon: "🛹",
      image: "/images/20221230_143623_1.jpg",
      order: 5,
    },
    {
      id: 6,
      year: "2023",
      title: "First Robotics Trophy",
      story:
        "Designed simple circuits and small robotics projects, winning my first trophy at the science fair. Sparks of making have ignited.",
      icon: "🏆",
      image: "/images/20230106_190703.jpg",
      order: 6,
    },
    {
      id: 7,
      year: "2024",
      title: "Striker on the Field",
      story:
        "Red and black stripes on the pitch. Posing with a soccer ball, playing football with the crew every evening.",
      icon: "⚽",
      image: "/images/20230312_105331.jpg",
      order: 7,
    },
    {
      id: 8,
      year: "2026",
      title: "Full-Stack Workspace",
      story:
        "Class 7. Managing my dual-monitor setup at Sidra House. Automating lights, writing Next.js code, and building robot buddies.",
      icon: "🚀",
      image: "/images/WhatsApp Image 2026-07-07 .jpeg",
      order: 8,
    },
  ],
  videos: [
    {
      id: 1,
      youtubeId: "2PojXjLpui4",
      title: "Epic Football Match",
      description: "My best goals and highlights from this season's local junior tournament.",
      thumbnail: "",
      category: "Football",
      duration: "12:45",
      timeAgo: "2 days ago",
      sticker: "🏆",
      featured: true,
      order: 1,
    },
    {
      id: 2,
      youtubeId: "2u8VQ5s0JWg",
      title: "Building My Robot",
      description: "Step-by-step assembly of my custom Arduino obstacle avoiding robot buddy.",
      thumbnail: "",
      category: "Robots",
      duration: "8:32",
      timeAgo: "1 week ago",
      sticker: "🤖",
      featured: true,
      order: 2,
    },
    {
      id: 3,
      youtubeId: "7rHipHlLAu8",
      title: "Swimming Day",
      description: "Beating my personal best record in the 50m pool during summer camp.",
      thumbnail: "",
      category: "Games",
      duration: "5:11",
      timeAgo: "2 weeks ago",
      sticker: "🌊",
      featured: true,
      order: 3,
    },
    {
      id: 4,
      youtubeId: "JDN4J0T0OzQ",
      title: "Cycle Adventure",
      description: "Exploring the offroad trails and hills around Korapra on two wheels.",
      thumbnail: "",
      category: "Adventure",
      duration: "5:20",
      timeAgo: "3 weeks ago",
      sticker: "🚲",
      featured: true,
      order: 4,
    },
    {
      id: 5,
      youtubeId: "SYWXxf8V2hY",
      title: "Family Trip Vlog",
      description: "Our weekend getaway to the beach and amusement park with Baba and siblings.",
      thumbnail: "",
      category: "Family",
      duration: "10:18",
      timeAgo: "3 month ago",
      sticker: "💖",
      featured: true,
      order: 5,
    },
  ],
};

