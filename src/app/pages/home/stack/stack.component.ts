import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import { SKILLS } from '../../../data/portfolio-content';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css',
})
export class StackComponent {
  readonly skillCategories = SKILLS;
}
