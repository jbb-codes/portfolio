import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([], withDisabledInitialNavigation()), provideLocationMocks()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render navbar logo with name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.navbar__logo');
    expect(el?.textContent?.trim()).toContain('Jarren Bess');
  });

  it('should render 4 nav links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.navbar__link');
    expect(links.length).toBe(4);
  });

  it('should render Home, About, Resume, Projects nav links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.navbar__link');
    const texts = Array.from(links).map(l => l.textContent?.trim());
    expect(texts).toContain('Home');
    expect(texts).toContain('About');
    expect(texts).toContain('Resume');
    expect(texts).toContain('Projects');
  });

  it('should render theme toggle button', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    expect(btn).toBeTruthy();
  });

  it('should default to dark mode', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isDarkMode).toBeTrue();
  });

  it('should toggle to light mode when button clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const btn: HTMLElement = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    btn.click();
    expect(fixture.componentInstance.isDarkMode).toBeFalse();
  });

  it('should toggle back to dark mode on second click', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const btn: HTMLElement = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    btn.click();
    btn.click();
    expect(fixture.componentInstance.isDarkMode).toBeTrue();
  });

  it('should start with isAnimating as false', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isAnimating).toBeFalse();
  });

  it('should set isAnimating to true immediately when toggle is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const btn: HTMLElement = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    btn.click();
    expect(fixture.componentInstance.isAnimating).toBeTrue();
  });

  it('should add is-animating class to toggle button when clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const btn: HTMLElement = fixture.nativeElement.querySelector('[data-testid="theme-toggle"]');
    btn.click();
    fixture.detectChanges();
    expect(btn.classList.contains('is-animating')).toBeTrue();
  });

  it('should not re-trigger toggle if already animating', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.isAnimating = true;
    const initialMode = fixture.componentInstance.isDarkMode;
    fixture.componentInstance.toggleTheme();
    expect(fixture.componentInstance.isDarkMode).toBe(initialMode);
  });

  it('should render 4 footer nav links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.footer__nav-link');
    expect(links.length).toBe(4);
  });

  it('should render footer GitHub link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="footer-github"]');
    expect(el).toBeTruthy();
  });

  it('should render footer LinkedIn link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="footer-linkedin"]');
    expect(el).toBeTruthy();
  });

  it('should render footer Email link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="footer-email"]');
    expect(el).toBeTruthy();
  });

  it('should render footer copyright with year', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.footer__copyright');
    expect(el?.textContent).toContain('2026');
  });
});
