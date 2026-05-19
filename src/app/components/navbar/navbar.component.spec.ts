import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router, withDisabledInitialNavigation } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';
import { routes } from '../../app.routes';

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

  describe('logo', () => {
    it('should display the site name', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector('[data-testid="navbar-logo"]');
      expect(el?.textContent?.trim()).toContain('Jarren Bess');
    });
  });

  describe('navigation links', () => {
    it('should display links to Home, About, Resume, and Projects', () => {
      const links: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll('[data-testid="navbar-link"]');
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
      btn = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-theme');
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
      it('should mark the button as animating immediately after click', () => {
        btn.click();
        fixture.detectChanges();
        expect(btn.classList.contains('is-animating')).toBeTrue();
      });

      it('should ignore a rapid second click while animating', () => {
        btn.click();
        btn.click();
        fixture.detectChanges();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
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

  describe('sliding underline', () => {
    it('should scope the underline indicator inside the nav links so it positions relative to them', () => {
      const container: HTMLElement = fixture.nativeElement.querySelector('[data-testid="navbar-links"]');
      const underline: HTMLElement | null = container?.querySelector('[data-testid="nav-underline"]') ?? null;
      expect(underline).toBeTruthy();
    });
  });
});

describe('NavbarComponent – underline positioning', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let appRef: ApplicationRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter(routes, withDisabledInitialNavigation()),
        provideLocationMocks(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    router = TestBed.inject(Router);
    appRef = TestBed.inject(ApplicationRef);
    fixture.detectChanges();
  });

  it('should position the underline under the active link on initial load', fakeAsync(() => {
    router.navigate(['/']);
    tick();
    appRef.tick();

    const container: HTMLElement = fixture.nativeElement.querySelector('[data-testid="navbar-links"]');
    expect(container.style.getPropertyValue('--underline-left')).not.toBe('');
    expect(container.style.getPropertyValue('--underline-width')).not.toBe('');
    discardPeriodicTasks();
  }));

  it('should reposition the underline when navigating to a different route', fakeAsync(() => {
    router.navigate(['/']);
    tick();
    appRef.tick();

    const container: HTMLElement = fixture.nativeElement.querySelector('[data-testid="navbar-links"]');
    const spy = spyOn(container.style, 'setProperty');

    router.navigate(['/about']);
    tick();
    appRef.tick();

    expect(spy).toHaveBeenCalled();
    discardPeriodicTasks();
  }));
});
