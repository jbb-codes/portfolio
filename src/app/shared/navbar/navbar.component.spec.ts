import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  describe('navigation links', () => {
    it('should display jump links to About, Work, Stack, and Bucket List', () => {
      const links: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll('[data-testid="navbar-link"]');
      const texts = Array.from(links).map((l) => l.textContent?.trim());
      expect(texts).toEqual(['About', 'Work', 'Stack', 'Bucket List']);
    });

    it('should point each link at its section on the home page', () => {
      const links: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll('[data-testid="navbar-link"]');
      const hrefs = Array.from(links).map((l) => l.getAttribute('href'));
      expect(hrefs).toEqual([
        '/#about',
        '/#work',
        '/#stack',
        '/#bucket-list',
      ]);
    });
  });

  describe('theme toggle', () => {
    let btn: HTMLElement;

    beforeEach(() => {
      btn = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    });

    it('should label the button as switching to light mode when in dark mode', () => {
      expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
    });

    it('should change the icon when switching between dark and light mode', () => {
      const darkSvg = btn.querySelector('svg')?.outerHTML;
      btn.click();
      fixture.detectChanges();
      const lightSvg = btn.querySelector('svg')?.outerHTML;
      expect(lightSvg).not.toBe(darkSvg);
    });

    describe('theme switching', () => {
      it('should default to dark mode', () => {
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
      });

      it('should switch to light mode on click', () => {
        btn.click();
        fixture.detectChanges();
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'light',
        );
        expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
      });

      it('should switch back to dark mode after animation clears', (done) => {
        btn.click();
        fixture.detectChanges();
        setTimeout(() => {
          btn.click();
          fixture.detectChanges();
          expect(
            document.documentElement.getAttribute('data-theme'),
          ).toBeNull();
          expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
          done();
        }, 450);
      });
    });

    describe('animation', () => {
      it('should mark the button as animating immediately after click', () => {
        btn.click();
        fixture.detectChanges();
        expect(btn.classList.contains('is-animating')).toBeTrue();
      });

      it('should ignore a rapid second click while animating', () => {
        btn.click();
        btn.click();
        fixture.detectChanges();
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'light',
        );
      });

      it('should clear the animating state after the animation completes', (done) => {
        btn.click();
        fixture.detectChanges();
        expect(btn.classList.contains('is-animating')).toBeTrue();
        setTimeout(() => {
          fixture.detectChanges();
          expect(btn.classList.contains('is-animating')).toBeFalse();
          done();
        }, 450);
      });
    });
  });
});
