import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { CustomCursorComponent } from './custom-cursor.component';

describe('CustomCursorComponent', () => {
  let fixture: ComponentFixture<CustomCursorComponent>;
  let component: CustomCursorComponent;
  let doc: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCursorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCursorComponent);
    component = fixture.componentInstance;
    doc = TestBed.inject(DOCUMENT);
    fixture.detectChanges();
  });

  afterEach(() => {
    const dot: HTMLElement = fixture.nativeElement.querySelector('.cursor-dot');
    if (dot) dot.style.transform = '';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('cursor dot element', () => {
    it('should render a cursor dot in the DOM', () => {
      const dot: HTMLElement = fixture.nativeElement.querySelector('.cursor-dot');
      expect(dot).toBeTruthy();
    });

    it('should mark the cursor dot as aria-hidden', () => {
      const dot: HTMLElement = fixture.nativeElement.querySelector('.cursor-dot');
      expect(dot.getAttribute('aria-hidden')).toBe('true');
    });

    // Coarse-pointer hiding is enforced by @media (pointer: coarse) { display: none }
    // in custom-cursor.component.css. jsdom does not evaluate media queries, so
    // coverage of that rule lives in the CSS file itself.
  });

  describe('mouse tracking', () => {
    it('should set transform on the cursor dot after mousemove', () => {
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 300 }));

      const dot: HTMLElement = fixture.nativeElement.querySelector('.cursor-dot');
      expect(dot.style.transform).toBe('translate(146px, 296px)');
    });

    it('should update transform on each successive mousemove', () => {
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }));
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 80 }));

      const dot: HTMLElement = fixture.nativeElement.querySelector('.cursor-dot');
      expect(dot.style.transform).toBe('translate(46px, 76px)');
    });
  });

  describe('cleanup', () => {
    it('should remove the mousemove listener from the document on destroy', () => {
      const spy = spyOn(doc, 'removeEventListener');
      fixture.destroy();
      expect(spy).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    });
  });
});
