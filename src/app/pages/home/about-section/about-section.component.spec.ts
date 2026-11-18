import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ABOUT_BIO,
  CERTIFICATIONS,
  EDUCATION,
  INTERESTS,
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
        root.querySelectorAll('[data-testid="bio-card"] p'),
      ).map((paragraph) => paragraph.textContent?.trim());
      expect(paragraphs).toEqual([
        ABOUT_BIO.blurb,
        ABOUT_BIO.journey,
        ABOUT_BIO.passion,
      ]);
    });

    it('renders one tag per interest', () => {
      const tags = Array.from(
        root.querySelectorAll('[data-testid="interest-tag"]'),
      ).map((tag) => tag.textContent?.trim());
      expect(tags).toEqual(INTERESTS.map((interest) => interest.label));
    });
  });

  describe('education and certifications card', () => {
    it('renders every education entry', () => {
      const entries = root.querySelectorAll('[data-testid="education-entry"]');
      expect(entries.length).toBe(EDUCATION.length);
      for (const [index, education] of EDUCATION.entries()) {
        expect(entries[index].textContent).toContain(education.degree);
        expect(entries[index].textContent).toContain(education.institution);
      }
    });

    it('renders every certification entry', () => {
      const entries = root.querySelectorAll(
        '[data-testid="certification-entry"]',
      );
      expect(entries.length).toBe(CERTIFICATIONS.length);
      for (const [index, certification] of CERTIFICATIONS.entries()) {
        expect(entries[index].textContent).toContain(certification.name);
        expect(entries[index].textContent).toContain(certification.issuer);
      }
    });
  });

  it('keeps the About heading', () => {
    expect(textOf('about-heading')).toBe('About');
  });
});
