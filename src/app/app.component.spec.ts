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
      it('should render 4 nav links', () => {
        const links = fixture.nativeElement.querySelectorAll('.navbar__link');
        expect(links.length).toBe(4);
      });

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

      it('should render the toggle button', () => {
        expect(btn).toBeTruthy();
      });

      describe('theme switching', () => {
        it('should default to dark mode', () => {
          expect(component.isDarkMode).toBeTrue();
        });

        it('should switch to light mode on click', () => {
          btn.click();
          expect(component.isDarkMode).toBeFalse();
        });

        it('should switch back to dark mode on second click after animation clears', () => {
          btn.click();
          component.clearAnimation();
          btn.click();
          expect(component.isDarkMode).toBeTrue();
        });
      });

      describe('animation', () => {
        it('should start with isAnimating as false', () => {
          expect(component.isAnimating).toBeFalse();
        });

        it('should set isAnimating to true immediately when clicked', () => {
          btn.click();
          expect(component.isAnimating).toBeTrue();
        });

        it('should add is-animating class to the button when clicked', () => {
          btn.click();
          fixture.detectChanges();
          expect(btn.classList.contains('is-animating')).toBeTrue();
        });

        it('should not re-trigger toggle if already animating', () => {
          component.isAnimating = true;
          const initialMode = component.isDarkMode;
          component.toggleTheme();
          expect(component.isDarkMode).toBe(initialMode);
        });

        it('should clear isAnimating via timeout fallback when animationend does not fire', (done) => {
          btn.click();
          expect(component.isAnimating).toBeTrue();
          setTimeout(() => {
            expect(component.isAnimating).toBeFalse();
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
