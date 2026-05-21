import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
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
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('footer', () => {
    it('should render 4 footer nav links', () => {
      const links = fixture.nativeElement.querySelectorAll(
        '[data-testid="footer-nav-link"]',
      );
      expect(links.length).toBe(4);
    });

    it('should render copyright with year', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="footer-copyright"]',
      );
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

  describe('particle background', () => {
    it('should render app-particle-background', () => {
      const el = fixture.nativeElement.querySelector(
        '[data-testid="particle-background"]',
      );
      expect(el).toBeTruthy();
    });
  });

  describe('route animation', () => {
    it('should have a route-animation-wrapper element in the main content area', () => {
      const wrapper: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="route-animation-wrapper"]',
      );
      expect(wrapper).toBeTruthy();
    });

    it('should have the router-outlet inside the animation wrapper', () => {
      const outlet: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="route-animation-wrapper"] router-outlet',
      );
      expect(outlet).toBeTruthy();
    });
  });
});
