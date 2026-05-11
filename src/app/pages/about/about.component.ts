// Collaborated with Claude on: public/ asset path vs src/assets/
import { Component } from '@angular/core';
import {
  LucideNetwork,
  LucideCodeXml,
  LucidePalette,
  LucideBot,
} from '@lucide/angular';
import { ParticleBackgroundComponent } from '../../components/particle-background/particle-background.component';

interface InterestCard {
  label: string;
  icon: unknown;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideNetwork, LucideCodeXml, LucidePalette, LucideBot, ParticleBackgroundComponent],
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
