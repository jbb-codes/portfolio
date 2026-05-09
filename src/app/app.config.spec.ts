import { TestBed } from '@angular/core/testing';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { createAppConfig } from './app.config';

function mockMatchMedia(prefersReducedMotion: boolean): void {
  spyOn(window, 'matchMedia').and.callFake(
    (query: string): MediaQueryList =>
      ({
        matches: prefersReducedMotion && query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

describe('createAppConfig', () => {
  describe('when prefers-reduced-motion: reduce is set', () => {
    beforeEach(() => mockMatchMedia(true));

    it('should use NoopAnimations', async () => {
      const config = createAppConfig();
      await TestBed.configureTestingModule({
        providers: [
          ...config.providers,
          provideRouter([], withDisabledInitialNavigation()),
          provideLocationMocks(),
        ],
      }).compileComponents();

      expect(TestBed.inject(ANIMATION_MODULE_TYPE)).toBe('NoopAnimations');
    });
  });

  describe('when prefers-reduced-motion is not set', () => {
    beforeEach(() => mockMatchMedia(false));

    it('should use BrowserAnimations', async () => {
      const config = createAppConfig();
      await TestBed.configureTestingModule({
        providers: [
          ...config.providers,
          provideRouter([], withDisabledInitialNavigation()),
          provideLocationMocks(),
        ],
      }).compileComponents();

      expect(TestBed.inject(ANIMATION_MODULE_TYPE)).toBe('BrowserAnimations');
    });
  });
});
