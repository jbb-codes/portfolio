import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export function createAppConfig(): ApplicationConfig {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      prefersReducedMotion ? provideNoopAnimations() : provideAnimations(),
    ],
  };
}

export const appConfig = createAppConfig();
