import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import {
  ABOUT_BIO,
  INTERESTS,
  TIMELINE_ENTRIES,
} from '../../../data/portfolio-content';

// Used Claude to help implement the About bento: bio card beside the
// education and certifications timeline.
@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  readonly bio = ABOUT_BIO;
  readonly interests = INTERESTS;
  readonly timeline = TIMELINE_ENTRIES;
}
