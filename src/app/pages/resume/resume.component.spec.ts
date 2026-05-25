import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeComponent } from './resume.component';

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // USER IMPLEMENTED
  // Worked through TDD thought process with Claude; implemented
  // with assistance
  // ============================================================
  describe('Experience section', () => {
    it('should display experience section', () => {
      const expSection = fixture.nativeElement.querySelector(
        '[data-testid="experience-entry"]',
      );
      expect(expSection).toBeTruthy();
    });

    it('should render one entry per experience item', () => {
      const entries = component.experience.length;
      const entryList = fixture.nativeElement.querySelectorAll(
        '[data-testid="experience-entry"]',
      ).length;
      expect(entryList).toEqual(entries);
    });
  });

  describe('Download PDF button', () => {
    it('should display the download PDF button', () => {
      const dlBtn = fixture.nativeElement.querySelector(
        '[data-testid="download-link"]',
      );

      expect(dlBtn).toBeTruthy();
    });

    it('should link to resume PDF', () => {
      const dlBtn = fixture.nativeElement.querySelector(
        '[data-testid="download-link"]',
      );
      expect(dlBtn?.getAttribute('href')).toBe('/docs/resume.pdf');
    });
  });
  // ============================================================

  describe('Certifications section', () => {
    it('should display certifications section', () => {
      const section = fixture.nativeElement.querySelector(
        '[data-testid="certification-entry"]',
      );
      expect(section).toBeTruthy();
    });

    it('should render one entry per certification item', () => {
      const entries = component.certifications.length;
      const rendered = fixture.nativeElement.querySelectorAll(
        '[data-testid="certification-entry"]',
      ).length;
      expect(rendered).toEqual(entries);
    });
  });

  describe('Skills section', () => {
    it('should display skills section', () => {
      const section = fixture.nativeElement.querySelector(
        '[data-testid="skill-entry"]',
      );
      expect(section).toBeTruthy();
    });

    it('should render one entry per skill item', () => {
      const entries = component.skills.length;
      const rendered = fixture.nativeElement.querySelectorAll(
        '[data-testid="skill-entry"]',
      ).length;
      expect(rendered).toEqual(entries);
    });
  });

  describe('Education section', () => {
    it('should display education section', () => {
      const section = fixture.nativeElement.querySelector(
        '[data-testid="education-entry"]',
      );
      expect(section).toBeTruthy();
    });

    it('should render one entry per education item', () => {
      const entries = component.education.length;
      const rendered = fixture.nativeElement.querySelectorAll(
        '[data-testid="education-entry"]',
      ).length;
      expect(rendered).toEqual(entries);
    });
  });
});
