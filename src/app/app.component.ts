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
}
