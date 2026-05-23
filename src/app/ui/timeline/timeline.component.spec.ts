import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { TimelineEntry } from '../../data/portfolio-content';

const EXPERIENCE_ENTRY: TimelineEntry = {
  date: '2023 – Present',
  title: 'Software Engineer',
  organization: 'Acme Corp',
  description: 'Built full stack features with Angular and Node.',
  type: 'experience',
};

const EDUCATION_ENTRY: TimelineEntry = {
  date: '2019 – 2023',
  title: 'B.S. Computer Science',
  organization: 'State University',
  description: 'Graduated magna cum laude.',
  type: 'education',
};

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.entries = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('empty input', () => {
    it('should render no entry elements when entries is empty', () => {
      component.entries = [];
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(
        '[data-testid="timeline-entry"]',
      );
      expect(items.length).toBe(0);
    });
  });

  describe('entry rendering', () => {
    beforeEach(() => {
      component.entries = [EXPERIENCE_ENTRY, EDUCATION_ENTRY];
      fixture.detectChanges();
    });

    it('should render the correct number of entries', () => {
      const items = fixture.nativeElement.querySelectorAll(
        '[data-testid="timeline-entry"]',
      );
      expect(items.length).toBe(2);
    });

    it('should display the date for each entry', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[0].textContent).toContain('2023 – Present');
      expect(items[1].textContent).toContain('2019 – 2023');
    });

    it('should display the title for each entry', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[0].textContent).toContain('Software Engineer');
      expect(items[1].textContent).toContain('B.S. Computer Science');
    });

    it('should display the organization for each entry', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[0].textContent).toContain('Acme Corp');
      expect(items[1].textContent).toContain('State University');
    });

    it('should display the description for each entry', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[0].textContent).toContain(
        'Built full stack features with Angular and Node.',
      );
      expect(items[1].textContent).toContain('Graduated magna cum laude.');
    });
  });

  describe('type distinction', () => {
    beforeEach(() => {
      component.entries = [EXPERIENCE_ENTRY, EDUCATION_ENTRY];
      fixture.detectChanges();
    });

    it('should apply experience modifier class to experience entries', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[0].classList).toContain('timeline__entry--experience');
    });

    it('should apply education modifier class to education entries', () => {
      const items: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '[data-testid="timeline-entry"]',
        );
      expect(items[1].classList).toContain('timeline__entry--education');
    });
  });

  describe('with four entries', () => {
    it('should render all four entries', () => {
      component.entries = [
        EXPERIENCE_ENTRY,
        { ...EXPERIENCE_ENTRY, title: 'Junior Dev', organization: 'Startup' },
        EDUCATION_ENTRY,
        {
          ...EDUCATION_ENTRY,
          title: 'A.S. Mathematics',
          organization: 'Community College',
        },
      ];
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(
        '[data-testid="timeline-entry"]',
      );
      expect(items.length).toBe(4);
    });
  });
});
