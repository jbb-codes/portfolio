import { Component, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { routeFadeAnimation } from './route-animations';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { OrbBackgroundComponent } from './shared/orb-background/orb-background.component';
import { ParticleBackgroundComponent } from './shared/particle-background/particle-background.component';

const KNOWN_PATHS = ['/', '/about', '/resume', '/projects'];

// Used Claude to help implement the root app shell: the route-driven navbar
// visibility signal, the skip-to-main accessibility link, and the fade
// animation host binding that wraps the router outlet.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    CustomCursorComponent,
    OrbBackgroundComponent,
    ParticleBackgroundComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeAnimation],
})
export class AppComponent {
  readonly showNavbar = signal(true);

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const path = (e as NavigationEnd).urlAfterRedirects.split('?')[0];
        this.showNavbar.set(KNOWN_PATHS.includes(path));
      });
  }

  skipToMain(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main-content');
    main?.focus({ preventScroll: true });
  }
}
