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
});
