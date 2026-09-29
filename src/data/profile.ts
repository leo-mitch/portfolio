// Edit this file to make the portfolio yours.

export const profile = {
  name: "Léo-Michel Poirier-Pigeon",
  handle: "leo-mitch",
  initials: "",
  avatar: "/avatar.jpg",
  verified: false,
  flipSentences: [
    "Full-Stack Developer",
    "Computer Science Student",
    "Penetration Tester",
    "Bug Bounty Hunter",
  ],
  job: { title: "Co-Founder & Developer", company: "Classmo", url: null } as {
    title: string;
    company: string | null;
    url: string | null;
  },
  location: "Sherbrooke, Québec",
  timeZone: "America/Toronto",
  email: "leomitch55@outlook.com",
  website: "https://leo-mitch.me",
  pronouns: "he/him",
  about: [
    "I'm a computer science student in the co-op program at the Université de Sherbrooke, with a strong focus on cybersecurity and full-stack development. I like building things end to end — from mobile apps and web platforms to security tooling.",
    "I co-founded Classmo, a student book marketplace that reached 200+ users in under a month. In my free time I hunt bugs and I play CTFs — I helped lead the team \"Lawsuit\" to the top 10 in Canada on Hack The Box. I'm currently working toward my CPTS certification and I'm open to co-op internships.",
  ],
};

// Falls back to the first letters of your name when `initials` is empty.
export const initials =
  profile.initials ||
  profile.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const socials = [
  { name: "GitHub", handle: "@leo-mitch", url: "https://github.com/leo-mitch", icon: "github" },
  { name: "LinkedIn", handle: "Léo-Michel Poirier-Pigeon", url: "https://linkedin.com/in/leo-michel-poirier-pigeon", icon: "linkedin" },
] as const;

export const stack = [
  "TypeScript",
  "JavaScript",
  "Python",
  "C",
  "C++",
  "C#",
  "Java",
  "PHP",
  "Solidity",
  "SQL",
  "React",
  "Next.js",
  "Node.js",
  "SvelteKit",
  "PostgreSQL",
  "Docker",
  "Git",
  "Linux",
  "Bash",
  "PowerShell",
  "Burp Suite",
  "Ghidra",
  "Nmap",
  "Wireshark",
];

export type Position = {
  title: string;
  period: string;
  type?: string;
  description: string[];
  skills: string[];
};

export const experience: {
  company: string;
  url?: string;
  current?: boolean;
  positions: Position[];
}[] = [
  {
    company: "Classmo",
    current: true,
    positions: [
      {
        title: "Co-Founder & Developer",
        period: "Jan 2026 — Present",
        type: "Co-founder",
        description: [
          "Launched a student book marketplace, reaching 200+ users and 350+ listings in under a month across iOS and Android.",
          "Built and shipped the Android app to production in one month with zero service interruptions.",
          "Won 1st place at ESG UQAM's Mon Entreprise competition, securing $10,000 in non-dilutive funding and three institutional partnerships.",
        ],
        skills: ["iOS", "Android", "Full-Stack", "Startup"],
      },
    ],
  },
  {
    company: "Self-employed",
    current: true,
    positions: [
      {
        title: "Bug Bounty Hunter",
        period: "2024 — Present",
        type: "Freelance",
        description: [
          "Perform authorized security assessments using reconnaissance, enumeration and exploitation methodologies.",
          "Identified and responsibly disclosed vulnerabilities such as XSS, broken access control (BAC) and IDOR.",
          "Submitted detailed technical reports on platforms like YesWeHack and Bugcrowd.",
        ],
        skills: ["Burp Suite", "Web Security", "Bug Bounty"],
      },
    ],
  },
  {
    company: "Hydro-Québec",
    url: "https://www.hydroquebec.com",
    positions: [
      {
        title: "IT User Services Intern (×2)",
        period: "Summer 2024 — Summer 2025",
        type: "Internship",
        description: [
          "Migrated 50+ secured workstations in under two months.",
          "Supported users with hardware, software and network issues across Microsoft environments and printers.",
          "Built a tool automating BitLocker key recovery and secure disk decryption for incident response and system recovery.",
        ],
        skills: ["Windows", "PowerShell", "IT Support"],
      },
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  period: string;
  status: "Live" | "In progress" | "Archived";
  url?: string;
  repo?: string;
  description: string[];
  skills: string[];
  featured?: boolean; // shown on the home page
};

export const projects: Project[] = [
  {
    slug: "classmo",
    featured: true,
    title: "Classmo",
    tagline: "A student book marketplace for iOS & Android",
    period: "2026",
    status: "Live",
    repo: "https://www.classmo.ca",
    description: [
      "A marketplace where students buy and sell used books, launched on iOS and Android and reaching 200+ users and 350+ listings within its first month.",
      "Co-founded and developed the app; won 1st place at ESG UQAM's Mon Entreprise competition with $10,000 in non-dilutive funding.",
    ],
    skills: ["iOS", "Android", "Full-Stack"],
  },
  {
    slug: "mamdani",
    featured: true,
    title: "Mamdani",
    tagline: "AI civic issue reporting for cities",
    period: "2026",
    status: "Archived",
    repo: "https://github.com/omaribrahim6/mamdani",
    description: [
      "A civic-issue reporting platform where residents describe infrastructure problems to an AI inspector by photo and conversation, while city officials triage and track repairs on a public dashboard.",
      "Won Best Use of Gemini API at Hack The Hill III. Built with Gemini (Live, Flash and embeddings), Next.js, React Native and PostgreSQL with pgvector.",
    ],
    skills: ["Next.js", "TypeScript", "Gemini API", "React Native", "PostgreSQL"],
  },
  {
    slug: "ctf-lawsuit",
    featured: true,
    title: "CTF Team — Lawsuit",
    tagline: "Top 10 in Canada on Hack The Box",
    period: "2024 — 2025",
    status: "Archived",
    description: [
      "Helped lead a 10-member CTF team on Hack The Box to the world top 100 and Canada top 10.",
      "Wrote Python scripts to automate CVE reproduction and validation, and solved challenges in exploitation, reverse engineering, cryptography and web security.",
    ],
    skills: ["Linux", "Python", "C++", "Reverse Engineering"],
  },
  {
    slug: "slan-revolution",
    title: "Slan Révolution",
    tagline: "Full-stack site for a 160+ person LAN event",
    period: "2026",
    status: "Archived",
    repo: "https://www.slanrevolution.net",
    description: [
      "A full-stack web app for a 160+ participant event at Cégep de Sept-Îles, with an API and interface to dynamically update the site for future editions.",
      "Shipped to production with the organizing team before the event date.",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    slug: "ros2-hmi",
    featured: true,
    title: "ROS2 Robot Dashboard",
    tagline: "Remote control & monitoring for a ROS 2 robot",
    period: "2026",
    status: "Archived",
    description: [
      "A SvelteKit dashboard to remotely monitor and control a Yahboom MicroROS-Pi5 robot, with real-time WebSocket control of movement and the camera servos.",
      "Built ROS 2 Python nodes for sensor data, a PostgreSQL-backed API, and a live camera feed with LiDAR obstacle detection.",
    ],
    skills: ["SvelteKit", "TypeScript", "Python", "ROS 2", "WebSockets", "PostgreSQL"],
  },
  {
    slug: "cve-2024-25641-cacti",
    featured: true,
    title: "CVE-2024-25641 — Cacti RCE",
    tagline: "Automated RCE exploit for Cacti 1.2.26",
    period: "2024",
    status: "Archived",
    repo: "https://github.com/leo-mitch/CVE-2024-25641-RCE-Automated-Exploit-Cacti-1.2.26",
    description: [
      "An automated exploit for CVE-2024-25641, an authenticated arbitrary file write in Cacti 1.2.26's Package Import feature that leads to remote code execution.",
      "Chains a local payload server and listener to drop and execute arbitrary PHP on the target, for authorized testing.",
    ],
    skills: ["Python", "Exploit Dev", "RCE", "Web Security"],
  },
  {
    slug: "cve-2024-41570-havoc",
    featured: true,
    title: "CVE-2024-41570 — Havoc C2 RCE",
    tagline: "SSRF + command injection PoC for Havoc C2",
    period: "2025",
    status: "Archived",
    repo: "https://github.com/leo-mitch/CVE-2024-41570-Havoc-C2-RCE",
    description: [
      "A proof-of-concept chaining SSRF with authenticated command injection to reach remote code execution on a Havoc C2 teamserver (versions 0.3–0.6).",
      "Demonstrates leaking teamserver origin IPs and running commands on the server.",
    ],
    skills: ["Python", "Bash", "SSRF", "Exploit Dev"],
  },
  {
    slug: "homecraft",
    title: "HomeCraft",
    tagline: "Self-hosted Minecraft server admin panel",
    period: "2026",
    status: "Archived",
    repo: "https://github.com/leo-mitch/HomeCraft",
    description: [
      "A self-hosted web dashboard to manage a local Minecraft server from a private interface — monitoring, console access, file management and player administration.",
      "Built with SvelteKit and TypeScript, with no internet exposure required.",
    ],
    skills: ["SvelteKit", "TypeScript", "Node.js", "Vite"],
  },
  {
    slug: "discord-ticket-bot",
    title: "Discord Ticket Bot",
    tagline: "Button-based support tickets for Discord",
    period: "2026",
    status: "Archived",
    repo: "https://github.com/leo-mitch/Discord-Ticket-Bot",
    description: [
      "A support-ticket bot for Discord: users open a ticket with a button click, and each one gets its own dedicated channel for handling.",
      "Coded from scratch with Node.js and Discord.js.",
    ],
    skills: ["Node.js", "Discord.js", "JavaScript"],
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    tagline: "This site, in black and green",
    period: "2026",
    status: "Live",
    repo: "https://github.com/leo-mitch/portfolio",
    description: [
      "My personal portfolio, built with Next.js and Tailwind CSS, with GSAP-powered motion and a terminal-inspired design.",
    ],
    skills: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

export const awards = [
  { title: "Hackathon Winner — Best Use of Gemini API", issuer: "Hack The Hill III", date: "2026" },
  { title: "1st Place — Mon Entreprise Startup Competition", issuer: "ESG UQAM", date: "2026" },
  { title: "Top 10 in Canada — Hack The Box", issuer: "Hack The Box", date: "2025" },
];

export const certifications: { title: string; issuer: string; date: string; url?: string }[] = [
  { title: "Certified Penetration Testing Specialist (CPTS)", issuer: "Hack The Box Academy", date: "In progress" },
  {
    title: "Blockchain Basics",
    issuer: "Cyfrin Updraft",
    date: "2025",
    url: "https://profiles.cyfrin.io/u/return/achievements/blockchain-basics",
  },
  {
    title: "Solidity Smart Contract Development",
    issuer: "Cyfrin Updraft",
    date: "2025",
    url: "https://profiles.cyfrin.io/u/return/achievements/solidity",
  },
  {
    title: "Advanced Web3 Wallet Security",
    issuer: "Cyfrin Updraft",
    date: "2025",
    url: "https://profiles.cyfrin.io/u/return/achievements/advanced-web3-wallet-security",
  },
];

export const posts: { title: string; date: string; slug: string }[] = [
  // { title: "Designing a pixel-perfect portfolio", date: "2026-08-12", slug: "#" },
];
