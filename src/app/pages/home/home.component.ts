import { Component } from '@angular/core';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { HeroComponent } from './hero/hero.component';

// Used Claude to help implement the home page shell: the hero and the empty
// anchored sections that later tickets fill in.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ContactSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
