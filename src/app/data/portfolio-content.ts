// Used Claude to help design the data model interfaces and structure all content
// as a single source of truth, keeping it separate from the presentation layer
// so any component can import exactly what it needs.
export interface ExperienceCard {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface TimelineEntry {
  date: string;
  title: string;
  organization: string;
  inProgress: boolean;
}

export interface InterestCard {
  label: string;
  iconName: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Project {
  number: number;
  name: string;
  githubUrl: string;
  screenshotUrl: string;
  description: string;
  technologies: string[];
  whatILearned: string;
}

export const EXPERIENCE: ExperienceCard[] = [];

export const SKILLS: SkillCategory[] = [
  {
    name: 'Programming Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Lua'],
  },
  {
    name: 'Frameworks & Libraries',
    skills: ['Angular', 'Node.js', 'Express', 'Next.js', 'React'],
  },
  {
    name: 'Databases & Storage',
    skills: ['MongoDB', 'SQL', 'NoSQL'],
  },
  {
    name: 'Tools & Platforms',
    skills: [
      'Git',
      'GitHub',
      'REST APIs',
      'Agile Development',
      'Model Context Protocol (MCP)',
      'CI/CD',
    ],
  },
  {
    name: 'AI & Automation',
    skills: [
      'Agentic AI',
      'Claude Code',
      'AI Agent Orchestration',
      'Automation Workflows',
      'LLM-Integrated Tooling',
    ],
  },
];

export const LEARNING_NEXT: string[] = [
  'Rust programming language',
  'WebAssembly (WASM)',
  'Three.js / WebGL',
  'Advanced RxJS patterns',
];

export const INTERESTS: InterestCard[] = [
  { label: 'Modern Software Practices', iconName: 'code-xml' },
  { label: 'UI/UX Design', iconName: 'palette' },
  { label: 'AI & App Security', iconName: 'shield' },
  { label: 'LLM Internals', iconName: 'bot' },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    date: 'IN PROGRESS',
    title: 'B.S. Web Development',
    organization: 'Bellevue University · GPA 4.0',
    inProgress: true,
  },
  {
    date: 'MAR 2026',
    title: 'The Modern Software Developer',
    organization: 'Vizuara AI Labs',
    inProgress: false,
  },
  {
    date: '2025',
    title: 'Pre-Security Certification',
    organization: 'TryHackMe',
    inProgress: false,
  },
  {
    date: '2015',
    title: 'A.S. Computer Programming',
    organization: 'Northeast State CC',
    inProgress: false,
  },
];

// Completed goals lead, then the rest in the design's order.
export const BUCKET_LIST: BucketListItem[] = [
  {
    id: '1',
    title: 'Build and deploy a full-stack app',
    description: 'Design, build, and launch a complete app',
    completed: true,
  },
  {
    id: '2',
    title: 'Contribute to open source',
    description: 'Get a PR merged into a major open-source project',
    completed: true,
  },
  {
    id: '6',
    title: 'Build a production AI-powered application',
    description: 'Ship an app where AI drives the core user experience',
    completed: true,
  },
  {
    id: '7',
    title: "Finish my bachelor's degree in web development",
    description: 'Complete my four-year degree and make it official',
    completed: false,
  },
  {
    id: '8',
    title: 'Climb a V10 boulder problem',
    description: 'Push my climbing to an elite bouldering grade',
    completed: false,
  },
  {
    id: '3',
    title: 'Ship a mobile app',
    description: 'Build a mobile app and publish it to the App Store',
    completed: false,
  },
  {
    id: '4',
    title: 'Work at a MAANG company',
    description: 'Land a role at Meta, Apple, Amazon, Netflix, or Google',
    completed: false,
  },
  {
    id: '5',
    title: 'Build a revenue-generating side project',
    description: 'Create something people value enough to pay for',
    completed: false,
  },
];

export const PROJECTS: Project[] = [
  {
    number: 1,
    name: 'Paper to Colab',
    githubUrl: 'https://github.com/jbb-codes/paper-to-colab',
    screenshotUrl: 'assets/images/projects/paperToColab.png',
    description:
      'A Next.js app that converts academic PDF papers into runnable Jupyter notebooks and opens them directly in Google Colab, powered by the Groq LLM API.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Groq API'],
    whatILearned:
      'Built a full-stack AI pipeline end-to-end, implemented rate limiting and security hardening, and integrated the Groq and GitHub Gists APIs in a production-grade Next.js app.',
  },
  {
    number: 2,
    name: 'Text to Audio',
    githubUrl: 'https://github.com/jbb-codes/audiobook-app',
    screenshotUrl: 'assets/images/projects/textToAudio.png',
    description:
      'A cross-platform desktop app that converts text files and scanned document images into audiobooks using a local text-to-speech model.',
    technologies: ['Electron', 'JavaScript', 'Node.js', 'kokoro-js'],
    whatILearned:
      'Gained experience building desktop apps with Electron, running a local AI TTS model, and using Tesseract OCR to extract text from scanned images.',
  },
  {
    number: 3,
    name: 'Weather App',
    githubUrl: 'https://github.com/jbb-codes/weather-app',
    screenshotUrl: 'assets/images/projects/weatherApp.png',
    description:
      'A web app that fetches real-time weather data for any city using the OpenWeatherMap API and displays current conditions and a 5-day forecast.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'OpenWeatherMap API'],
    whatILearned:
      'Practiced consuming a third-party REST API, handling async data, and building a responsive UI with vanilla JavaScript.',
  },
];

export interface AboutBio {
  blurb: string;
  journey: string;
  passion: string;
}

export const ABOUT_BIO: AboutBio = {
  blurb:
    "I build modern, performant web applications with clean code and thoughtful design. Passionate about creating seamless user experiences from front to back.",
  journey:
    'I discovered programming through a desire to build things that solve real problems. That curiosity led me to dive deep into web development, where I found the perfect intersection of logic and creativity.',
  passion:
    "I care deeply about developer experience, clean architecture, and creating interfaces that feel intuitive. Outside of code, I'm interested in travel, enjoy climbing, and continuous learning.",
};
