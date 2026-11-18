import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css',
})
export class SectionHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  // The parent section points aria-labelledby at this id.
  readonly headingId = input.required<string>();
}
