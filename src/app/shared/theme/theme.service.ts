import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isDarkModeSubject = new BehaviorSubject<boolean>(true);
  private readonly isAnimatingSubject = new BehaviorSubject<boolean>(false);

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

    setTimeout(() => this.isAnimatingSubject.next(false), 400);
  }
}
