import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypingAnimationDirective } from '../typing-animation.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TypingAnimationDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  readonly roleStrings = ['Agentic', 'Full Stack', 'Modern Software'];
  readonly orbitRings = [1, 2, 3];
}
