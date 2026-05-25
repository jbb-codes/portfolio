import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_KEY = 'theme';
const LIGHT_VALUE = 'light';

// Used Claude to help implement the reactive theme toggle. Dark mode is the
// default — localStorage stores 'light' explicitly, and the absence of that
// key means dark. The animation lock prevents double-toggling mid-transition.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isDarkModeSubject = new BehaviorSubject<boolean>(
    this.loadIsDark(),
  );
  private readonly isAnimatingSubject = new BehaviorSubject<boolean>(false);
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly isDarkMode$ = this.isDarkModeSubject.asObservable();
  readonly isAnimating$ = this.isAnimatingSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkModeSubject.getValue());
  }

  toggle(): void {
    if (this.isAnimatingSubject.getValue()) return;

    this.isAnimatingSubject.next(true);
    const isDark = !this.isDarkModeSubject.getValue();
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? '' : LIGHT_VALUE);

    this.animationTimeout = setTimeout(() => this.clearAnimation(), 400);
  }

  clearAnimation(): void {
    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
    this.isAnimatingSubject.next(false);
  }

  private loadIsDark(): boolean {
    return localStorage.getItem(THEME_KEY) !== LIGHT_VALUE;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', LIGHT_VALUE);
    }
  }
}
