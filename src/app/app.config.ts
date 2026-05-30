import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';

import { routes } from './app.routes';

// Used Claude to help implement the app-level provider setup, including the
// reduced-motion check that swaps Angular's animation engine for a no-op at
// the root so every animated component inherits the preference automatically.
export function createAppConfig(): ApplicationConfig {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideClientHydration(),
      provideRouter(routes),
      prefersReducedMotion ? provideNoopAnimations() : provideAnimations(),
    ],
  };
}

export const appConfig = createAppConfig();
