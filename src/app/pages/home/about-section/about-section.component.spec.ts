import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ABOUT_BIO,
  INTERESTS,
  TIMELINE_ENTRIES,
} from '../../../data/portfolio-content';
import { AboutSectionComponent } from './about-section.component';

describe('AboutSectionComponent', () => {
  let fixture: ComponentFixture<AboutSectionComponent>;
  let root: HTMLElement;

  const textOf = (testId: string): string =>
    root.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AboutSectionComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  describe('bio card', () => {
    it('leads with the intro blurb before journey and passion text', () => {
      const paragraphs = Array.from(
        root.querySelectorAll('[data-testid="bio-card"] p:not([data-testid="bio-label"])'),
      ).map((paragraph) => paragraph.textContent?.trim());
      expect(paragraphs).toEqual([
        ABOUT_BIO.blurb,
        ABOUT_BIO.journey,
        ABOUT_BIO.passion,
      ]);
    });

    it('labels the journey and passion paragraphs', () => {
      const labels = Array.from(
        root.querySelectorAll('[data-testid="bio-label"]'),
      ).map((label) => label.textContent?.trim());
      expect(labels).toEqual(['MY JOURNEY', "WHAT I'M PASSIONATE ABOUT"]);
    });

    it('renders one tag per interest', () => {
      const tags = Array.from(
        root.querySelectorAll('[data-testid="interest-tag"]'),
      ).map((tag) => tag.textContent?.trim());
      expect(tags).toEqual(INTERESTS.map((interest) => interest.label));
    });
  });

  describe('education and certifications card', () => {
    const entries = (): HTMLElement[] =>
      Array.from(root.querySelectorAll('[data-testid="timeline-entry"]'));

    it('renders one entry per timeline item, newest first', () => {
      const rendered = entries().map((entry) => [
        entry.querySelector('[data-testid="timeline-date"]')?.textContent?.trim(),
        entry.querySelector('[data-testid="timeline-title"]')?.textContent?.trim(),
        entry.querySelector('[data-testid="timeline-organization"]')?.textContent?.trim(),
      ]);
      expect(rendered).toEqual(
        TIMELINE_ENTRIES.map((entry) => [
          entry.date,
          entry.title,
          entry.organization,
        ]),
      );
    });

    it('highlights only the in-progress entry', () => {
      const highlighted = entries().map((entry) =>
        entry.classList.contains('about__timeline-entry--active'),
      );
      expect(highlighted).toEqual(
        TIMELINE_ENTRIES.map((entry) => entry.inProgress),
      );
    });
  });

  it('opens with the numbered eyebrow and centered heading', () => {
    expect(textOf('section-eyebrow')).toBe('01 — ABOUT');
    expect(root.querySelector('h2#about-heading')?.textContent?.trim()).toBe(
      'Secure, Clean Code.',
    );
  });

  it('labels the education card with its combined heading', () => {
    expect(textOf('timeline-heading')).toBe('EDUCATION & CERTIFICATIONS');
  });
});
