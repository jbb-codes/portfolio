import { Component } from '@angular/core';
import {
  LucideNetwork,
  LucideCodeXml,
  LucidePalette,
  LucideBot,
} from '@lucide/angular';

interface InterestCard {
  label: string;
  icon: unknown;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideNetwork, LucideCodeXml, LucidePalette, LucideBot],
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
}
