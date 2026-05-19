import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routeFadeAnimation } from './route-animations';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrbBackgroundComponent } from './components/orb-background/orb-background.component';
import { ParticleBackgroundComponent } from './components/particle-background/particle-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent, CustomCursorComponent, OrbBackgroundComponent, ParticleBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeAnimation],
})
export class AppComponent {}
