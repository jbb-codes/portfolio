import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isDarkMode$', () => {
    it('should default to true (dark mode)', () => {
      let isDark!: boolean;
      service.isDarkMode$.subscribe(isDarkMode => (isDark = isDarkMode));
      expect(isDark).toBeTrue();
    });

    it('should emit false after first toggle', fakeAsync(() => {
      const emissions: boolean[] = [];
      service.isDarkMode$.subscribe(isDarkMode => emissions.push(isDarkMode));
      service.toggle();
      tick(400);
      expect(emissions).toEqual([true, false]);
    }));

    it('should emit true again after a second toggle once animation clears', fakeAsync(() => {
      const emissions: boolean[] = [];
      service.isDarkMode$.subscribe(isDarkMode => emissions.push(isDarkMode));
      service.toggle();
      tick(400);
      service.toggle();
      tick(400);
      expect(emissions).toEqual([true, false, true]);
    }));
  });

  describe('clearAnimation()', () => {
    it('should set isAnimating to false', fakeAsync(() => {
      let isAnimating!: boolean;
      service.isAnimating$.subscribe(animating => (isAnimating = animating));
      service.toggle();
      service.clearAnimation();
      expect(isAnimating).toBeFalse();
      tick(400);
    }));

    it('should cancel the pending timeout so a subsequent toggle is not prematurely cleared', fakeAsync(() => {
      let isAnimating!: boolean;
      service.isAnimating$.subscribe(animating => (isAnimating = animating));
      service.toggle();
      tick(350); // simulate animationend at 350ms
      service.clearAnimation(); // cancels the original 400ms timeout
      service.toggle(); // new toggle: timer now fires at t=750ms
      tick(50); // t=400 — where the cancelled timer would have fired
      expect(isAnimating).toBeTrue(); // new animation still running
      tick(400); // t=800 — new timer has fired
      expect(isAnimating).toBeFalse();
    }));
  });

  describe('toggle()', () => {
    it('should set data-theme to "light" when switching out of dark mode', fakeAsync(() => {
      service.toggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      tick(400);
    }));

    it('should remove data-theme when switching back to dark mode', fakeAsync(() => {
      service.toggle();
      tick(400);
      service.toggle();
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
      tick(400);
    }));

    it('should debounce rapid calls — second call within animation window is ignored', fakeAsync(() => {
      service.toggle(); // dark → light
      service.toggle(); // ignored: still animating
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      tick(400);
    }));

    it('should not emit an extra isDarkMode value on a debounced rapid call', fakeAsync(() => {
      const emissions: boolean[] = [];
      service.isDarkMode$.subscribe(isDarkMode => emissions.push(isDarkMode));
      service.toggle();
      service.toggle(); // ignored
      tick(400);
      expect(emissions).toEqual([true, false]);
    }));
  });
});
