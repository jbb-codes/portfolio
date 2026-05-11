// Collaborated with Claude on: animation guard pattern, prefers-reduced-motion fix, lucide-angular icon integration
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { routeFadeAnimation } from './route-animations';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideSun, LucideMoon, CustomCursorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeAnimation],
})
export class AppComponent {
  isDarkMode = true;
  isAnimating = false;

  toggleTheme(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setTimeout(() => this.clearAnimation(), 400);
  }

  clearAnimation(): void {
    this.isAnimating = false;
  }
}
