import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let root: HTMLElement;

  const query = (testId: string): HTMLElement | null =>
    root.querySelector(`[data-testid="${testId}"]`);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('shows the name as the page heading', () => {
    expect(root.querySelector('h1')?.textContent).toContain('Jarren Bess');
  });

  it('renders the avatar with alt text', () => {
    const avatar = query('hero-avatar') as HTMLImageElement;
    expect(avatar).toBeTruthy();
    expect(avatar.getAttribute('alt')).toBeTruthy();
  });

  it('fetches the avatar at high priority since it is the largest paint', () => {
    const avatar = query('hero-avatar') as HTMLImageElement;
    expect(avatar.getAttribute('fetchpriority')).toBe('high');
  });

  it('renders decorative orbit rings hidden from assistive tech', () => {
    const rings = root.querySelectorAll('[data-testid="hero-orbit-ring"]');
    expect(rings.length).toBeGreaterThanOrEqual(2);
    rings.forEach((ring) =>
      expect(ring.getAttribute('aria-hidden')).toBe('true'),
    );
  });

  it('introduces the hero with a system-online status eyebrow', () => {
    expect(query('hero-status')?.textContent?.trim()).toBe(
      "HI, I'M — SYSTEM ONLINE",
    );
  });

  it('labels the avatar with the current focus badge', () => {
    expect(query('hero-focus-tag')?.textContent?.trim()).toBe(
      'AGENTIC AI · LLM TOOLING',
    );
  });

  it('separates the typed role from the Developer label with a space', () => {
    const roleLine = query('hero-role-line');
    expect(roleLine?.textContent).toMatch(/\sDeveloper$/);
  });

  it('renders the typing role element', () => {
    expect(query('hero-role')).toBeTruthy();
  });

  it('links Get in touch to the contact section', () => {
    const link = query('hero-contact-button');
    expect(link?.textContent).toContain('Get in touch');
    expect(link?.getAttribute('href')).toBe('/#contact');
  });

  it('opens the resume PDF in a new tab', () => {
    const link = query('hero-resume-button');
    expect(link?.textContent).toContain('Resume');
    expect(link?.getAttribute('href')).toBe('docs/Jarren_Bess_Resume.pdf');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });

  it('keeps the focus tag inside a 320px wide layout', () => {
    root.style.display = 'block';
    root.style.width = '320px';

    const hostBox = root.getBoundingClientRect();
    const tagBox = query('hero-focus-tag')!.getBoundingClientRect();

    expect(tagBox.left).toBeGreaterThanOrEqual(hostBox.left);
    expect(tagBox.right).toBeLessThanOrEqual(hostBox.right);
  });
});
