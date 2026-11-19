import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageScroller {
  private readonly window = inject(DOCUMENT).defaultView;

  scrollToTop(): void {
    if (!this.window) return;
    const prefersReducedMotion = this.window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // Explicit behavior: the global scroll-behavior CSS only covers the
    // no-preference case, and routerLink alone does nothing on the home route.
    this.window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  }
}
