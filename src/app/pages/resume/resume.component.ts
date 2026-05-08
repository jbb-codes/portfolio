import { Component } from '@angular/core';

interface Certification {
  name: string;
  issuer: string;
  year: string;
  details: string;
}

interface Skill {
  name: string;
  level: number;
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

interface ExperienceCard {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  details: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent {
  readonly learningNext: string[] = [
    'Rust programming language',
    'WebAssembly (WASM)',
    'Three.js / WebGL',
    'Advanced RxJS patterns',
  ];

  readonly certifications: Certification[] = [
    {
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      year: '2024',
      details: 'Proficiency in developing and deploying cloud-based applications on AWS.',
    },
    {
      name: 'Angular Developer Certification',
      issuer: 'Google',
      year: '2023',
      details: 'Demonstrated expertise in building scalable Angular applications.',
    },
  ];

  readonly skills: Skill[] = [
    { name: 'TypeScript', level: 85 },
    { name: 'Angular', level: 80 },
    { name: 'HTML & CSS', level: 90 },
    { name: 'JavaScript', level: 88 },
    { name: 'Node.js', level: 65 },
    { name: 'Git', level: 75 },
  ];

  readonly education: EducationEntry[] = [
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

  readonly experience: ExperienceCard[] = [
    {
      title: 'Frontend Developer',
      company: 'Acme Corp',
      startDate: 'Jan 2023',
      endDate: 'Present',
      details:
        'Built and maintained Angular applications for enterprise clients.',
    },
    {
      title: 'Web Developer Intern',
      company: 'Startup Co',
      startDate: 'May 2022',
      endDate: 'Dec 2022',
      details: 'Developed responsive UI components and integrated REST APIs.',
    },
  ];
}
