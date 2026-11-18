import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSectionComponent } from './contact-section.component';

describe('ContactSectionComponent', () => {
  let fixture: ComponentFixture<ContactSectionComponent>;
  let root: HTMLElement;

  const link = (testId: string): HTMLAnchorElement =>
    root.querySelector(`[data-testid="${testId}"]`) as HTMLAnchorElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSectionComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('renders the headline as the section heading', () => {
    const heading = root.querySelector('h2#contact-heading');
    expect(heading?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      "Let's build something together.",
    );
  });

  it('renders Email me, GitHub and Resume buttons in order', () => {
    const labels = Array.from(
      root.querySelectorAll('a[data-testid^="contact-"]'),
    ).map((button) => button.textContent?.trim());
    expect(labels).toEqual(['Email me', 'GitHub', 'Resume']);
  });

  it('opens the mail client from the Email button', () => {
    expect(link('contact-email').getAttribute('href')).toBe(
      'mailto:bessjarren@yahoo.com',
    );
  });

  it('opens the GitHub profile in a new tab safely', () => {
    const github = link('contact-github');
    expect(github.getAttribute('href')).toBe('https://github.com/jbb-codes');
    expect(github.getAttribute('target')).toBe('_blank');
    expect(github.getAttribute('rel')).toContain('noopener');
  });

  it('opens the resume PDF in a new tab', () => {
    const resume = link('contact-resume');
    expect(resume.getAttribute('href')).toBe('/docs/Jarren_Bess_Resume.pdf');
    expect(resume.getAttribute('target')).toBe('_blank');
  });
});
