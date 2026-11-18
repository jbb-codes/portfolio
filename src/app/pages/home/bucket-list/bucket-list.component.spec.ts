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

  it('should render the section heading', () => {
    expect(host.querySelector('h2')?.textContent).toContain('Bucket List');
  });

  it('should show how many items are completed out of the total', () => {
    const count = host.querySelector('[data-testid="bucket-count"]');
    expect(count?.textContent).toContain(
      `${completedTotal} of ${BUCKET_LIST.length}`,
    );
  });

  it('should expose progress to assistive tech as a progressbar', () => {
    const bar = host.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe(String(completedTotal));
    expect(bar?.getAttribute('aria-valuemin')).toBe('0');
    expect(bar?.getAttribute('aria-valuemax')).toBe(String(BUCKET_LIST.length));
    expect(bar?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should size the bar fill to the completed percentage', () => {
    const fill = host.querySelector<HTMLElement>('[data-testid="bucket-fill"]');
    const expected = (completedTotal / BUCKET_LIST.length) * 100;
    expect(parseFloat(fill!.style.width)).toBeCloseTo(expected, 1);
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
