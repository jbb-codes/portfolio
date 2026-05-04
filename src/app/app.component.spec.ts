// Used Claude to help generate
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('navbar', () => {
    it('should render logo with name', () => {
      const el: HTMLElement =
        fixture.nativeElement.querySelector('.navbar__logo');
      expect(el?.textContent?.trim()).toContain('Jarren Bess');
    });

    describe('navigation links', () => {
      it('should render Home, About, Resume, and Projects links', () => {
        const links: NodeListOf<HTMLElement> =
          fixture.nativeElement.querySelectorAll('.navbar__link');
        const texts = Array.from(links).map((l) => l.textContent?.trim());
        expect(texts).toContain('Home');
        expect(texts).toContain('About');
        expect(texts).toContain('Resume');
        expect(texts).toContain('Projects');
      });
    });

    describe('theme toggle', () => {
      let btn: HTMLElement;

      beforeEach(() => {
        btn = fixture.nativeElement.querySelector(
          '[data-testid="theme-toggle"]',
        );
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-theme');
      });

      it('should render the toggle button', () => {
        expect(btn).toBeTruthy();
      });

      it('should render an svg icon inside the toggle button', () => {
        const svg = btn.querySelector('svg');
        expect(svg).toBeTruthy();
      });

      it('should render a different svg icon after switching to light mode', () => {
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
          expect(document.documentElement.getAttribute('data-theme')).toBe('light');
          expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
        });

        it('should switch back to dark mode after animation clears', (done) => {
          btn.click();
          fixture.detectChanges();
          setTimeout(() => {
            btn.click();
            fixture.detectChanges();
            expect(document.documentElement.getAttribute('data-theme')).toBeNull();
            expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
            done();
          }, 450);
        });
      });

      describe('animation', () => {
        it('should add is-animating class to the button when clicked', () => {
          btn.click();
          fixture.detectChanges();
          expect(btn.classList.contains('is-animating')).toBeTrue();
        });

        it('should not change theme on rapid second click', () => {
          btn.click();
          btn.click();
          fixture.detectChanges();
          expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });

        it('should remove is-animating class after animation timeout', (done) => {
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

  describe('footer', () => {
    it('should render 4 footer nav links', () => {
      const links = fixture.nativeElement.querySelectorAll('.footer__nav-link');
      expect(links.length).toBe(4);
    });

    it('should render copyright with year', () => {
      const el: HTMLElement =
        fixture.nativeElement.querySelector('.footer__copyright');
      expect(el?.textContent).toContain('2026');
    });

    describe('social links', () => {
      it('should render GitHub link', () => {
        const el = fixture.nativeElement.querySelector(
          '[data-testid="footer-github"]',
        );
        expect(el).toBeTruthy();
      });

      it('should render LinkedIn link', () => {
        const el = fixture.nativeElement.querySelector(
          '[data-testid="footer-linkedin"]',
        );
        expect(el).toBeTruthy();
      });

      it('should render Email link', () => {
        const el = fixture.nativeElement.querySelector(
          '[data-testid="footer-email"]',
        );
        expect(el).toBeTruthy();
      });
    });
  });
});
