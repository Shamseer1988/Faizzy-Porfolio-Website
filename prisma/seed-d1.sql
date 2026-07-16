-- Seed data for Cloudflare D1 (generated from the default content).
-- Apply after migrations:  wrangler d1 execute faizzyworld-db --remote --file=./prisma/seed-d1.sql

DELETE FROM "Profile";
INSERT INTO "Profile" ("id", "fullName", "displayFirst", "displayHighlight", "displayLast", "roles", "bio", "age", "className", "school", "house", "youtubeUrl", "youtubeHandle", "statusTag", "projectsCount", "updatedAt") VALUES (1, 'Muhammed Zohan Faizzy', 'Muhammed', 'Zohan', 'Faizzy', '["Young Coder 💻","AI Robot Builder 🤖","Smart-Home Captain 🏠","Footballer ⚽","YouTuber 🎬","Skater 🛹"]', '11-year-old maker from Sidra House, Korapra — Class 7 at Markaz Public School, Koyilandy. I build AI robots, run our smart home, score goals and make videos for my channel Faizzy World.', 11, '7', 'Markaz Public School, Koyilandy', 'Sidra House, Korapra', 'https://www.youtube.com/@faizzyworld3556', '@faizzyworld3556', 'building robots & big dreams', 12, '2026-07-16T13:23:05.686+00:00');

DELETE FROM "Skill";
INSERT INTO "Skill" ("id", "name", "percent", "order") VALUES (11, 'Smart Home · Home Assistant & Tuya', 85, 1);
INSERT INTO "Skill" ("id", "name", "percent", "order") VALUES (12, 'Coding & App Building', 80, 2);
INSERT INTO "Skill" ("id", "name", "percent", "order") VALUES (13, 'AI & Robotics Projects', 75, 3);
INSERT INTO "Skill" ("id", "name", "percent", "order") VALUES (14, 'Electronics & Circuits', 70, 4);
INSERT INTO "Skill" ("id", "name", "percent", "order") VALUES (15, 'Video Creation (AI-powered)', 65, 5);

DELETE FROM "Hobby";
INSERT INTO "Hobby" ("id", "label", "order") VALUES (17, '⚽ Football', 1);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (18, '🛹 Skating', 2);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (19, '🚴 Cycling', 3);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (20, '🌟 Football stars', 4);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (21, '🎈 Friends time', 5);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (22, '🎬 YouTube', 6);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (23, '🤖 Robot toys', 7);
INSERT INTO "Hobby" ("id", "label", "order") VALUES (24, '💡 Wild ideas', 8);

DELETE FROM "Project";
INSERT INTO "Project" ("id", "title", "description", "icon", "tag", "accent", "tools", "order", "visible") VALUES (9, 'AI Robot Buddy', 'A voice-controlled robot friend that answers questions and follows commands. Next milestone: making it roll to my room.', '🤖', 'In progress', 'cyan', '["AI","Robotics","Sensors"]', 1, 1);
INSERT INTO "Project" ("id", "title", "description", "icon", "tag", "accent", "tools", "order", "visible") VALUES (10, 'Sidra Smart Home', 'Lights, plugs and sensors around our house, automated with Home Assistant and Tuya — I write the automations myself.', '🏠', 'Live at home', 'lime', '["Home Assistant","Tuya","Automation"]', 2, 1);
INSERT INTO "Project" ("id", "title", "description", "icon", "tag", "accent", "tools", "order", "visible") VALUES (11, 'Electronics Lab', 'LEDs, buzzers, motors and circuit boards — learning how the hardware under every smart device actually works.', '💡', 'Weekend lab', 'amber', '["Circuits","Arduino-style","Soldering (supervised!)"]', 3, 1);
INSERT INTO "Project" ("id", "title", "description", "icon", "tag", "accent", "tools", "order", "visible") VALUES (12, 'Mini App Studio', 'Building small apps with Baba using the same tools the pros use — this very portfolio is our project together.', '📱', 'Learning', 'cyan', '["Next.js","TypeScript","Cloudflare"]', 4, 1);

DELETE FROM "FamilyMember";
INSERT INTO "FamilyMember" ("id", "name", "relation", "emoji", "order") VALUES (9, 'Shamseer Makkanamchery', 'Father · my coding & smart-home coach', '👨‍💻', 1);
INSERT INTO "FamilyMember" ("id", "name", "relation", "emoji", "order") VALUES (10, 'Amalnisa Shamseer', 'Mother · chief of everything', '👩', 2);
INSERT INTO "FamilyMember" ("id", "name", "relation", "emoji", "order") VALUES (11, 'Amina Zahra Shamseer', 'Sister · style department', '👧', 3);
INSERT INTO "FamilyMember" ("id", "name", "relation", "emoji", "order") VALUES (12, 'Nooh Muhammed Shamseer', 'Brother · junior lab assistant', '👦', 4);

DELETE FROM "GalleryItem";
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (13, '/images/scooter.jpg', 'Speed mode: ON 🚴', 1);
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (14, '/images/awesome.jpg', 'Certified Awesome Bro 😎', 2);
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (15, '/images/WhatsApp Image 2026-07-07 at 8.44.29 PM.jpeg', 'Team Sidra House crew out in the wild 🚗', 3);
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (16, '/images/20230427_075920.jpg', 'Big smiles and summer adventures ☀️', 4);
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (17, '/images/20210618_182607.jpg', 'Sunny days in the backyard 🌳', 5);
INSERT INTO "GalleryItem" ("id", "src", "caption", "order") VALUES (18, '/images/20200814_175509.jpg', 'Exploring the fields and grass 🌾', 6);

DELETE FROM "Milestone";
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (17, '2014', 'Hello, world!', 'The journey begins — Sidra House welcomes its future chief engineer. First baby smiles in the lab.', '👶', '/images/20190913_221517.jpg', 1);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (18, '2019', 'The Tech Toddler', 'Curious about computers since day one. Mimicking Baba''s programming sessions, discovering the desk, mouse and laptop.', '💻', '/images/20200705_225431.jpg', 2);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (19, '2020', 'Promoted to Big Brother', 'Welcomed baby brother Nooh to the crew. Posing together at Sidra House, expanding the maker lab staff.', '👦', '/images/20200731_052602.jpg', 3);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (20, '2021', 'First Workspace & Classes', 'Online school gave me my first personal study desk. Setting up my workspace, learning to type and compile simple lines.', '🖥️', '/images/20210526_225247.jpg', 4);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (21, '2022', 'Conquering the Skateboard', 'Safety gear on, helmet strapped, neighborhood ready. Mastered balancing and rolling on four wheels.', '🛹', '/images/20221230_143623_1.jpg', 5);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (22, '2023', 'First Robotics Trophy', 'Designed simple circuits and small robotics projects, winning my first trophy at the science fair. Sparks of making have ignited.', '🏆', '/images/20230106_190703.jpg', 6);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (23, '2024', 'Striker on the Field', 'Red and black stripes on the pitch. Posing with a soccer ball, playing football with the crew every evening.', '⚽', '/images/20230312_105331.jpg', 7);
INSERT INTO "Milestone" ("id", "year", "title", "story", "icon", "image", "order") VALUES (24, '2026', 'Full-Stack Workspace', 'Class 7. Managing my dual-monitor setup at Sidra House. Automating lights, writing Next.js code, and building robot buddies.', '🚀', '/images/WhatsApp Image 2026-07-07 .jpeg', 8);

DELETE FROM "Video";
INSERT INTO "Video" ("id", "youtubeId", "title", "description", "thumbnail", "category", "duration", "timeAgo", "sticker", "featured", "order") VALUES (11, '2PojXjLpui4', 'Epic Football Match', 'My best goals and highlights from this season''s local junior tournament.', '', 'Football', '12:45', '2 days ago', '🏆', 1, 1);
INSERT INTO "Video" ("id", "youtubeId", "title", "description", "thumbnail", "category", "duration", "timeAgo", "sticker", "featured", "order") VALUES (12, '2u8VQ5s0JWg', 'Building My Robot', 'Step-by-step assembly of my custom Arduino obstacle avoiding robot buddy.', '', 'Robots', '8:32', '1 week ago', '🤖', 1, 2);
INSERT INTO "Video" ("id", "youtubeId", "title", "description", "thumbnail", "category", "duration", "timeAgo", "sticker", "featured", "order") VALUES (13, '7rHipHlLAu8', 'Swimming Day', 'Beating my personal best record in the 50m pool during summer camp.', '', 'Games', '5:11', '2 weeks ago', '🌊', 1, 3);
INSERT INTO "Video" ("id", "youtubeId", "title", "description", "thumbnail", "category", "duration", "timeAgo", "sticker", "featured", "order") VALUES (14, 'JDN4J0T0OzQ', 'Cycle Adventure', 'Exploring the offroad trails and hills around Korapra on two wheels.', '', 'Adventure', '5:20', '3 weeks ago', '🚲', 1, 4);
INSERT INTO "Video" ("id", "youtubeId", "title", "description", "thumbnail", "category", "duration", "timeAgo", "sticker", "featured", "order") VALUES (15, 'SYWXxf8V2hY', 'Family Trip Vlog', 'Our weekend getaway to the beach and amusement park with Baba and siblings.', '', 'Family', '10:18', '3 month ago', '💖', 1, 5);

