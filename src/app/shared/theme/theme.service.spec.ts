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
      let value!: boolean;
      service.isDarkMode$.subscribe(v => (value = v));
      expect(value).toBeTrue();
    });

    it('should emit false after first toggle', fakeAsync(() => {
      const emitted: boolean[] = [];
      service.isDarkMode$.subscribe(v => emitted.push(v));
      service.toggle();
      tick(400);
      expect(emitted).toEqual([true, false]);
    }));

    it('should emit true again after a second toggle once animation clears', fakeAsync(() => {
      const emitted: boolean[] = [];
      service.isDarkMode$.subscribe(v => emitted.push(v));
      service.toggle();
      tick(400);
      service.toggle();
      tick(400);
      expect(emitted).toEqual([true, false, true]);
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
      const emitted: boolean[] = [];
      service.isDarkMode$.subscribe(v => emitted.push(v));
      service.toggle();
      service.toggle(); // ignored
      tick(400);
      expect(emitted).toEqual([true, false]);
    }));
  });
});
