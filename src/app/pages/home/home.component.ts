import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { TypingAnimationDirective } from './typing-animation.directive';
import { WorkSpotlightComponent } from './work-spotlight/work-spotlight.component';

// Used Claude to help implement the home page shell: the hero and the empty
// anchored sections that later tickets fill in.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    TypingAnimationDirective,
    ContactSectionComponent,
    WorkSpotlightComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly roleStrings = ['Agentic', 'Full Stack', 'Modern Software'];
}
