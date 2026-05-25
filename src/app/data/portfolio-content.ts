export interface ExperienceCard {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  details: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  organization: string;
  description: string;
  type: 'experience' | 'education';
  completed: boolean;
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

export const EDUCATION: EducationEntry[] = [
  {
    degree: 'B.S. Web Development',
    institution: 'Bellevue University',
    year: 'In Progress',
    details: "Currently pursuing a bachelor's degree in web development.",
  },
  {
    degree: 'A.S. Computer Programming',
    institution: 'Northeast State Technical Community College',
    year: '2015',
    details:
      'Studied programming fundamentals and object-oriented programming principles.',
  },
];

export const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 50 },
  { name: 'Angular', level: 50 },
  { name: 'HTML & CSS', level: 80 },
  { name: 'JavaScript', level: 80 },
  { name: 'Node.js', level: 65 },
  { name: 'Git', level: 75 },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Modern Software Developer Bootcamp',
    issuer: 'Vizuara',
    year: '2026',
    details:
      'Hands-on bootcamp covering AI-assisted development with Claude Code and building full-stack web applications.',
  },
  {
    name: 'Pre-Security Certification',
    issuer: 'TryHackMe',
    year: '2025',
    details:
      'Completed modules covering networking fundamentals, how the web works, operating systems basics, and core cybersecurity concepts including the CIA triad and cryptography.',
  },
];

export const LEARNING_NEXT: string[] = [
  'Rust programming language',
  'WebAssembly (WASM)',
  'Three.js / WebGL',
  'Advanced RxJS patterns',
];

export const INTERESTS: InterestCard[] = [
  { label: 'Modern Software Development Practices', iconName: 'code-xml' },
  { label: 'UI/UX Design', iconName: 'palette' },
  { label: 'Blockchain Development', iconName: 'network' },
  { label: 'LLM Architecture & Internals', iconName: 'bot' },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    date: 'In Progress',
    title: 'B.S. Web Development',
    organization: 'Bellevue University',
    description: "Currently pursuing a bachelor's degree in web development.",
    type: 'education',
    completed: false,
  },
  {
    date: '2015',
    title: 'A.S. Computer Programming',
    organization: 'Northeast State Technical Community College',
    description:
      'Studied programming fundamentals and object-oriented programming principles.',
    type: 'education',
    completed: true,
  },
];

export const BUCKET_LIST: BucketListItem[] = [
  {
    id: '1',
    title: 'Build and deploy a full-stack app',
    description: 'Ship something real that actual users interact with',
    completed: false,
  },
  {
    id: '2',
    title: 'Contribute to open source',
    description: 'Get a PR merged into a major open-source project',
    completed: true,
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
  {
    id: '6',
    title: 'Build a production AI-powered application',
    description: 'Ship an app where AI drives the core user experience',
    completed: false,
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
