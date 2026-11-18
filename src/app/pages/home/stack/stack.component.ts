import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SKILLS } from '../../../data/portfolio-content';

@Component({
  selector: 'app-stack',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css',
})
export class StackComponent {
  readonly skillCategories = SKILLS;
}
