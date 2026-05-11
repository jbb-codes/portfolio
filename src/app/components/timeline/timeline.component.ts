import { Component, Input } from '@angular/core';
import { TimelineEntry } from './timeline-entry.interface';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {
  @Input() entries: TimelineEntry[] = [];
}
