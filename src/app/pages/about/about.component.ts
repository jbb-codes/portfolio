import { Component } from '@angular/core';
import {
  LucideNetwork,
  LucideCodeXml,
  LucidePalette,
  LucideBot,
} from '@lucide/angular';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { TimelineEntry } from '../../components/timeline/timeline-entry.interface';

interface InterestCard {
  label: string;
  icon: unknown;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideNetwork, LucideCodeXml, LucidePalette, LucideBot, TimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly interests: InterestCard[] = [
    { label: 'Modern Software Development Practices', icon: LucideCodeXml },
    { label: 'UI/UX Design', icon: LucidePalette },
    { label: 'Cryptocurrency / Blockchain Development', icon: LucideNetwork },
    { label: 'LLM Architecture & Internals', icon: LucideBot },
  ];

  readonly timelineEntries: TimelineEntry[] = [
    {
      date: '2024 – Present',
      title: 'Full Stack Developer',
      organization: 'Freelance',
      description: 'Building modern web applications with Angular, TypeScript, and Node.js for clients across various industries.',
      type: 'experience',
    },
    {
      date: '2022 – 2024',
      title: 'Junior Software Engineer',
      organization: 'Tech Startup',
      description: 'Contributed to a SaaS platform, shipping features end-to-end from database schema to polished UI.',
      type: 'experience',
    },
    {
      date: '2019 – 2023',
      title: 'B.S. Computer Science',
      organization: 'State University',
      description: 'Studied algorithms, systems, and software engineering. Graduated with honors.',
      type: 'education',
    },
    {
      date: '2017 – 2019',
      title: 'A.S. Mathematics',
      organization: 'Community College',
      description: 'Foundation in discrete math, calculus, and linear algebra before transferring to a four-year program.',
      type: 'education',
    },
  ];
}
