import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  let fixture: ComponentFixture<SectionHeaderComponent>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeaderComponent);
    fixture.componentRef.setInput('eyebrow', '01 — ABOUT');
    fixture.componentRef.setInput('heading', 'Clean code, thoughtful design.');
    fixture.componentRef.setInput('headingId', 'about-heading');
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('renders the eyebrow above the heading', () => {
    expect(
      root.querySelector('[data-testid="section-eyebrow"]')?.textContent,
    ).toBe('01 — ABOUT');
  });

  it('renders the heading as an h2 with the given id for aria-labelledby', () => {
    const heading = root.querySelector('h2');
    expect(heading?.id).toBe('about-heading');
    expect(heading?.textContent).toBe('Clean code, thoughtful design.');
  });
});
