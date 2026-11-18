import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';

// Selectors (without the pseudo-class) of every element-specific :focus-visible
// rule that draws an outline. The global `:focus-visible` rule is skipped so
// the navbar cannot pass on it alone. The shorthand is read as text because
// var() leaves the longhand outline-style empty in the CSSOM.
function collectFocusRingSelectors(): string[] {
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        rule.selectorText.includes(':focus-visible') &&
        /^(?!none|0\b)\S/.test(rule.style.getPropertyValue('outline')),
    )
    .flatMap((rule) =>
      rule.selectorText
        .split(',')
        .map((selector) => selector.replace(':focus-visible', '').trim()),
    )
    .filter((selector) => selector !== '');
}

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

  describe('layout', () => {
    it('should show the name on the left, before the links', () => {
      const brand: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="navbar-brand"]',
      );
      const links = fixture.nativeElement.querySelector(
        '[data-testid="navbar-links"]',
      );
      expect(brand.textContent?.trim()).toBe('Jarren Bess');
      expect(
        brand.compareDocumentPosition(links) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should link the name to the top of the home page', () => {
      const brand: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="navbar-brand"]',
      );
      expect(brand.getAttribute('href')).toBe('/');
    });

    it('should pin the bar to the top of the viewport', () => {
      const bar = fixture.nativeElement.querySelector('.navbar');
      document.body.appendChild(fixture.nativeElement);
      const style = getComputedStyle(bar);
      expect(style.position).toBe('fixed');
      expect(style.top).toBe('0px');
    });

    it('should expose a labelled navigation landmark', () => {
      const nav = fixture.nativeElement.querySelector('nav');
      expect(nav.getAttribute('aria-label')).toBe('Main navigation');
    });

    // el.focus() does not trigger :focus-visible in a headless browser (the
    // document has no window focus), so assert the stylesheet rules instead.
    it('should show a visible focus ring on links and the toggle', () => {
      const focusRingSelectors = collectFocusRingSelectors();
      const focusables: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('a, button'),
      );
      expect(focusables.length).toBe(6);
      focusables.forEach((el) => {
        expect(focusRingSelectors.some((selector) => el.matches(selector)))
          .withContext(el.outerHTML)
          .toBeTrue();
      });
    });
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
