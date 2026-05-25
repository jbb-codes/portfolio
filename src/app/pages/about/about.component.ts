import { Component, OnDestroy, signal } from '@angular/core';
import {
  LucideIcon,
  LucideNetwork,
  LucideCodeXml,
  LucidePalette,
  LucideBot,
  LucideDynamicIcon,
} from '@lucide/angular';
import {
  InterestCard,
  TimelineEntry,
  INTERESTS,
  TIMELINE_ENTRIES,
} from '../../data/portfolio-content';

const EMAIL_ADDRESS = 'bessjarren@yahoo.com';
const TOAST_DURATION_MS = 2000;

// Used Claude to help implement the about page, including the icon map that
// bridges string-keyed Lucide icons from the data layer to the component, and
// the email copy-to-clipboard toast with a debounced reset.
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucideDynamicIcon],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnDestroy {
  readonly iconMap: Record<string, LucideIcon> = {
    'code-xml': LucideCodeXml,
    palette: LucidePalette,
    network: LucideNetwork,
    bot: LucideBot,
  };

  readonly interests: InterestCard[] = INTERESTS;
  readonly timelineEntries: TimelineEntry[] = TIMELINE_ENTRIES;
  readonly emailCopied = signal(false);

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  copyEmail(): void {
    navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
      this.emailCopied.set(true);
      if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = setTimeout(() => {
        this.emailCopied.set(false);
      }, TOAST_DURATION_MS);
    });
  }

  ngOnDestroy(): void {
    if (this.toastTimeoutId !== null) clearTimeout(this.toastTimeoutId);
  }
}
