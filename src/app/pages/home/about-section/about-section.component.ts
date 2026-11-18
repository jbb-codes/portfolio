import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ABOUT_BIO,
  CERTIFICATIONS,
  EDUCATION,
  INTERESTS,
} from '../../../data/portfolio-content';

// Used Claude to help implement the About bento: bio card beside the
// education and certifications card.
@Component({
  selector: 'app-about-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
})
export class AboutSectionComponent {
  readonly bio = ABOUT_BIO;
  readonly interests = INTERESTS;
  readonly education = EDUCATION;
  readonly certifications = CERTIFICATIONS;
}
