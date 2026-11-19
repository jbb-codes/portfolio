import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SKILLS } from '../../../data/portfolio-content';
import { StackComponent } from './stack.component';

describe('StackComponent', () => {
  let fixture: ComponentFixture<StackComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  const rows = () =>
    Array.from(
      host.querySelectorAll<HTMLElement>('[data-testid="stack-row"]'),
    );

  it('renders the numbered eyebrow and heading', () => {
    expect(host.querySelector('[data-testid="section-eyebrow"]')?.textContent).toContain(
      '03 — STACK',
    );
    const heading = host.querySelector('h2');
    expect(heading?.id).toBe('stack-heading');
    expect(heading?.textContent).toContain('Tools I work with.');
  });

  it('renders one row per skill category, in content order', () => {
    const labels = rows().map((row) =>
      row.querySelector('[data-testid="stack-label"]')?.textContent?.trim(),
    );
    expect(labels).toEqual(SKILLS.map((category) => category.name));
  });

  it('renders every skill of each category as a tag', () => {
    rows().forEach((row, index) => {
      const tags = Array.from(
        row.querySelectorAll('[data-testid="stack-tag"]'),
      ).map((tag) => tag.textContent?.trim());
      expect(tags).toEqual(SKILLS[index].skills);
    });
  });

  it('renders a single container holding every row', () => {
    const containers = host.querySelectorAll('[data-testid="stack-container"]');
    expect(containers.length).toBe(1);
    expect(containers[0].querySelectorAll('[data-testid="stack-row"]').length).toBe(
      SKILLS.length,
    );
  });

  it('gives every row identical styling with no featured variant', () => {
    const classLists = rows().map((row) => row.className);
    expect(new Set(classLists).size).toBe(1);
    expect(host.querySelector('[class*="featured"]')).toBeNull();
  });

  // The row layout follows the container's width, so these tests size the
  // host directly instead of depending on the browser window.
  const setHostWidth = (widthPx: number): void => {
    host.style.display = 'block';
    host.style.width = `${widthPx}px`;
  };

  describe('stacked rows on narrow containers', () => {
    beforeEach(() => setHostWidth(360));

    it('centers the label above its chips', () => {
      rows().forEach((row) => {
        const label = row.querySelector<HTMLElement>('[data-testid="stack-label"]')!;
        const firstTag = row.querySelector<HTMLElement>('[data-testid="stack-tag"]')!;
        const rowBox = row.getBoundingClientRect();
        const labelBox = label.getBoundingClientRect();
        expect(labelBox.bottom).toBeLessThanOrEqual(firstTag.getBoundingClientRect().top);
        expect(
          Math.abs(labelBox.left + labelBox.width / 2 - (rowBox.left + rowBox.width / 2)),
        ).toBeLessThan(2);
      });
    });

    it('hides the dash that only makes sense side by side', () => {
      rows().forEach((row) => {
        const separator = row.querySelector<HTMLElement>('.stack__separator')!;
        expect(getComputedStyle(separator).display).toBe('none');
      });
    });
  });

  describe('side-by-side rows on wide containers', () => {
    const MAX_LABEL_TO_CHIPS_GAP_PX = 40;

    beforeEach(() => setHostWidth(1000));

    const parts = (row: HTMLElement) => ({
      label: row.querySelector<HTMLElement>('[data-testid="stack-label"]')!,
      separator: row.querySelector<HTMLElement>('.stack__separator'),
      tags: row.querySelector<HTMLElement>('.stack__tags')!,
      firstTag: row.querySelector<HTMLElement>('[data-testid="stack-tag"]')!,
    });

    it('keeps each label right next to its chips', () => {
      rows().forEach((row) => {
        const { label, separator, firstTag } = parts(row);
        const labelEnd = Math.max(
          label.getBoundingClientRect().right,
          separator?.getBoundingClientRect().right ?? 0,
        );
        const firstTagBox = firstTag.getBoundingClientRect();
        expect(firstTagBox.top).toBeLessThan(label.getBoundingClientRect().bottom);
        expect(firstTagBox.left - labelEnd).toBeLessThan(MAX_LABEL_TO_CHIPS_GAP_PX);
      });
    });

    it('centers the label and chips together in the row', () => {
      rows().forEach((row) => {
        const { label, tags } = parts(row);
        const rowBox = row.getBoundingClientRect();
        const groupLeft = label.getBoundingClientRect().left;
        const groupRight = tags.getBoundingClientRect().right;
        const groupCenter = (groupLeft + groupRight) / 2;
        const rowCenter = rowBox.left + rowBox.width / 2;
        expect(Math.abs(groupCenter - rowCenter)).toBeLessThan(2);
      });
    });

    it('separates the label from its chips with a visible dash', () => {
      rows().forEach((row) => {
        const { separator } = parts(row);
        expect(separator?.textContent?.trim()).toBe('–');
        expect(separator?.getAttribute('aria-hidden')).toBe('true');
        expect(getComputedStyle(separator!).display).not.toBe('none');
      });
    });
  });
});
