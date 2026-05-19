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

export const EXPERIENCE: ExperienceCard[] = [
  {
    title: 'Frontend Developer',
    company: 'Acme Corp',
    startDate: 'Jan 2023',
    endDate: 'Present',
    details: 'Built and maintained Angular applications for enterprise clients.',
  },
  {
    title: 'Web Developer Intern',
    company: 'Startup Co',
    startDate: 'May 2022',
    endDate: 'Dec 2022',
    details: 'Developed responsive UI components and integrated REST APIs.',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    degree: 'B.S. Computer Science',
    institution: 'State University',
    year: '2022',
    details: 'Focused on software engineering and web technologies.',
  },
  {
    degree: 'A.S. Information Technology',
    institution: 'Community College',
    year: '2020',
    details: "Graduated with honors. Dean's List all semesters.",
  },
];

export const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 85 },
  { name: 'Angular', level: 80 },
  { name: 'HTML & CSS', level: 90 },
  { name: 'JavaScript', level: 88 },
  { name: 'Node.js', level: 65 },
  { name: 'Git', level: 75 },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'AWS Certified Developer – Associate',
    issuer: 'Amazon Web Services',
    year: '2024',
    details:
      'Proficiency in developing and deploying cloud-based applications on AWS.',
  },
  {
    name: 'Angular Developer Certification',
    issuer: 'Google',
    year: '2023',
    details: 'Demonstrated expertise in building scalable Angular applications.',
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
  { label: 'Cryptocurrency / Blockchain Development', iconName: 'network' },
  { label: 'LLM Architecture & Internals', iconName: 'bot' },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    date: '2024 – Present',
    title: 'Full Stack Developer',
    organization: 'Freelance',
    description:
      'Building modern web applications with Angular, TypeScript, and Node.js for clients across various industries.',
    type: 'experience',
  },
  {
    date: '2022 – 2024',
    title: 'Junior Software Engineer',
    organization: 'Tech Startup',
    description:
      'Contributed to a SaaS platform, shipping features end-to-end from database schema to polished UI.',
    type: 'experience',
  },
  {
    date: '2019 – 2023',
    title: 'B.S. Computer Science',
    organization: 'State University',
    description:
      'Studied algorithms, systems, and software engineering. Graduated with honors.',
    type: 'education',
  },
  {
    date: '2017 – 2019',
    title: 'A.S. Mathematics',
    organization: 'Community College',
    description:
      'Foundation in discrete math, calculus, and linear algebra before transferring to a four-year program.',
    type: 'education',
  },
];

export const BUCKET_LIST: BucketListItem[] = [
  {
    id: '1',
    title: 'Visit Japan',
    description: 'Experience Japanese culture, cuisine, and landscapes',
    completed: false,
  },
  {
    id: '2',
    title: 'Learn to surf',
    description: 'Catch waves on the California coast',
    completed: false,
  },
  {
    id: '3',
    title: 'Run a marathon',
    description: 'Complete a full 26.2 mile race',
    completed: true,
  },
  {
    id: '4',
    title: 'Write a book',
    description: 'Share knowledge and stories through writing',
    completed: false,
  },
  {
    id: '5',
    title: 'See the Northern Lights',
    description: 'Witness the aurora borealis in Iceland',
    completed: false,
  },
  {
    id: '6',
    title: 'Learn Thai cooking',
    description: 'Master the art of authentic Thai cuisine',
    completed: false,
  },
  {
    id: '7',
    title: 'Hike the Appalachian Trail',
    description: 'Complete a section of the famous trail',
    completed: false,
  },
  {
    id: '8',
    title: 'Build a startup',
    description: 'Launch a product that solves a real problem',
    completed: false,
  },
];
