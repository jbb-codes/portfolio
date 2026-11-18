import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';

// Used Claude to help implement the home page shell: the hero and the empty
// anchored sections that later tickets fill in. The hero lives in HeroComponent.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
