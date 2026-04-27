import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
