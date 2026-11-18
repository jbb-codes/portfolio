import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';

import { routes } from './app.routes';

// Used Claude to help implement the app-level provider setup, including the
// reduced-motion check that swaps Angular's animation engine for a no-op at
// the root so every animated component inherits the preference automatically.
// On touch devices the app boots late, after the browser has already restored
// the reload position. Angular's scroll-to-top would then yank the page back
// up (smoothly, because of scroll-behavior), so leave restoration to the browser.
export function resolveScrollRestoration(
  isTouchDevice: boolean,
): 'enabled' | 'disabled' {
  return isTouchDevice ? 'disabled' : 'enabled';
}

export function createAppConfig(): ApplicationConfig {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideClientHydration(),
      provideRouter(
        routes,
        withInMemoryScrolling({
          anchorScrolling: 'enabled',
          scrollPositionRestoration: resolveScrollRestoration(isTouchDevice),
        }),
      ),
      prefersReducedMotion ? provideNoopAnimations() : provideAnimations(),
    ],
  };
}

export const appConfig = createAppConfig();
