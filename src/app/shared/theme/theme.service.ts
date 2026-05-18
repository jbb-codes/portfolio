import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isDarkModeSubject = new BehaviorSubject<boolean>(true);
  private readonly isAnimatingSubject = new BehaviorSubject<boolean>(false);
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly isDarkMode$ = this.isDarkModeSubject.asObservable();
  readonly isAnimating$ = this.isAnimatingSubject.asObservable();

  toggle(): void {
    if (this.isAnimatingSubject.getValue()) return;

    this.isAnimatingSubject.next(true);
    const isDark = !this.isDarkModeSubject.getValue();
    this.isDarkModeSubject.next(isDark);

    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    this.animationTimeout = setTimeout(() => this.clearAnimation(), 400);
  }

  clearAnimation(): void {
    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
    this.isAnimatingSubject.next(false);
  }
}
