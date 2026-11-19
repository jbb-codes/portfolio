import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BucketListComponent } from './bucket-list.component';
import { BUCKET_LIST } from '../../../data/portfolio-content';

describe('BucketListComponent', () => {
  let fixture: ComponentFixture<BucketListComponent>;
  let host: HTMLElement;

  const completedTotal = BUCKET_LIST.filter((item) => item.completed).length;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BucketListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BucketListComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  it('should render the numbered eyebrow and section heading', () => {
    expect(
      host.querySelector('[data-testid="section-eyebrow"]')?.textContent,
    ).toBe('04 — BUCKET LIST');
    expect(host.querySelector('h2')?.textContent).toBe(
      "Where I'm headed next.",
    );
  });

  it('should show how many items are completed out of the total', () => {
    const count = host.querySelector('[data-testid="bucket-count"]');
    expect(count?.textContent?.trim()).toBe(
      `${completedTotal} / ${BUCKET_LIST.length} COMPLETE`,
    );
  });

  it('should list completed goals before open ones', () => {
    const completionOrder = BUCKET_LIST.map((item) => item.completed);
    expect(completionOrder).toEqual([...completionOrder].sort().reverse());
  });

  it('should end with the V10 boulder goal', () => {
    const pills = host.querySelectorAll('[data-testid="bucket-pill"]');
    expect(pills[pills.length - 1].textContent).toContain('Climb a V10 boulder problem');
  });

  it('should render one bar segment per item, filled up to the completed count', () => {
    const segments = Array.from(
      host.querySelectorAll('[data-testid="bucket-segment"]'),
    );
    expect(segments.length).toBe(BUCKET_LIST.length);
    segments.forEach((segment, index) => {
      expect(segment.classList.contains('bucket__segment--filled'))
        .withContext(`segment ${index}`)
        .toBe(index < completedTotal);
    });
  });

  it('should expose progress to assistive tech as a progressbar', () => {
    const bar = host.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe(String(completedTotal));
    expect(bar?.getAttribute('aria-valuemin')).toBe('0');
    expect(bar?.getAttribute('aria-valuemax')).toBe(String(BUCKET_LIST.length));
    expect(bar?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should render one pill per bucket list item', () => {
    const pills = host.querySelectorAll('[data-testid="bucket-pill"]');
    expect(pills.length).toBe(BUCKET_LIST.length);
  });

  it('should mark completed pills as checked and others as unchecked', () => {
    const pills = host.querySelectorAll('[data-testid="bucket-pill"]');
    BUCKET_LIST.forEach((item, index) => {
      expect(pills[index].classList.contains('bucket-pill--checked'))
        .withContext(item.title)
        .toBe(item.completed);
    });
  });

  it('should announce each pill state to screen readers', () => {
    const pills = host.querySelectorAll('[data-testid="bucket-pill"]');
    BUCKET_LIST.forEach((item, index) => {
      const status = pills[index].querySelector('.sr-only');
      expect(status?.textContent?.trim())
        .withContext(item.title)
        .toBe(item.completed ? 'Completed' : 'Not completed');
    });
  });

  it('should keep the decorative check icon hidden from screen readers', () => {
    const icon = host.querySelector('.bucket-pill__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });
});
