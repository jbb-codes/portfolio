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

  const tiles = () =>
    Array.from(
      host.querySelectorAll<HTMLElement>('[data-testid="stack-tile"]'),
    );

  it('renders the numbered eyebrow and heading', () => {
    expect(host.querySelector('.stack__eyebrow')?.textContent).toContain(
      '03 — STACK',
    );
    const heading = host.querySelector('h2');
    expect(heading?.id).toBe('stack-heading');
    expect(heading?.textContent).toContain('Tools I work with.');
  });

  it('renders one tile per skill category, in content order', () => {
    const labels = tiles().map((tile) =>
      tile.querySelector('[data-testid="stack-label"]')?.textContent?.trim(),
    );
    expect(labels).toEqual(SKILLS.map((category) => category.name));
  });

  it('renders every skill of each category as a tag', () => {
    tiles().forEach((tile, index) => {
      const tags = Array.from(
        tile.querySelectorAll('[data-testid="stack-tag"]'),
      ).map((tag) => tag.textContent?.trim());
      expect(tags).toEqual(SKILLS[index].skills);
    });
  });

  it('highlights only the last category tile', () => {
    const featured = tiles().filter((tile) =>
      tile.classList.contains('stack__tile--featured'),
    );
    expect(featured).toEqual([tiles()[SKILLS.length - 1]]);
  });
});
