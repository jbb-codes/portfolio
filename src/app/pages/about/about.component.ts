import { Component } from '@angular/core';
import {
  LucideIcon,
  LucideNetwork,
  LucideCodeXml,
  LucidePalette,
  LucideBot,
  LucideDynamicIcon,
} from '@lucide/angular';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import {
  InterestCard,
  TimelineEntry,
  INTERESTS,
  TIMELINE_ENTRIES,
} from '../../data/portfolio-content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideDynamicIcon, TimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly iconMap: Record<string, LucideIcon> = {
    'code-xml': LucideCodeXml,
    palette: LucidePalette,
    network: LucideNetwork,
    bot: LucideBot,
  };

  readonly interests: InterestCard[] = INTERESTS;
  readonly timelineEntries: TimelineEntry[] = TIMELINE_ENTRIES;
}
