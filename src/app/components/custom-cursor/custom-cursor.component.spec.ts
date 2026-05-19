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
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('cursor dot element', () => {
    it('should render a cursor dot in the DOM', () => {
      const dot = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      expect(dot).toBeTruthy();
    });

    it('should mark the cursor dot as aria-hidden', () => {
      const dot = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      expect(dot.getAttribute('aria-hidden')).toBe('true');
    });

    // Coarse-pointer hiding is enforced by @media (pointer: coarse) { display: none }
    // in custom-cursor.component.css. jsdom does not evaluate media queries, so
    // coverage of that rule lives in the CSS file itself.
  });

  describe('mouse tracking', () => {
    it('should set transform on the cursor dot after mousemove', () => {
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 300 }));

      const dot: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      expect(dot.style.transform).toBe('translate(146px, 296px)');
    });

    it('should update transform on each successive mousemove', () => {
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }));
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 80 }));

      const dot: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      expect(dot.style.transform).toBe('translate(46px, 76px)');
    });
  });

  describe('proximity click', () => {
    it('does nothing extra when the click target is already an interactive element', () => {
      const button = doc.createElement('button');
      doc.body.appendChild(button);
      const proximityClickSpy = spyOn(button, 'click');

      button.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(proximityClickSpy).not.toHaveBeenCalled();
      doc.body.removeChild(button);
    });

    it('clicks the nearest interactive element when a non-interactive area is clicked nearby', () => {
      const nonInteractiveDiv = doc.createElement('div');
      const nearbyButton = doc.createElement('button');
      doc.body.appendChild(nonInteractiveDiv);
      doc.body.appendChild(nearbyButton);

      const clickSpy = spyOn(nearbyButton, 'click');
      spyOn(doc, 'elementFromPoint').and.callFake((x: number, y: number) => {
        // Simulate the button sitting just outside the exact click point
        return x === 100 && y === 100 ? nonInteractiveDiv : nearbyButton;
      });

      nonInteractiveDiv.dispatchEvent(
        new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 }),
      );

      expect(clickSpy).toHaveBeenCalledTimes(1);
      doc.body.removeChild(nonInteractiveDiv);
      doc.body.removeChild(nearbyButton);
    });

    it('does nothing when no interactive element is within the ring radius', () => {
      const nonInteractiveDiv = doc.createElement('div');
      doc.body.appendChild(nonInteractiveDiv);

      spyOn(doc, 'elementFromPoint').and.returnValue(nonInteractiveDiv);
      const clickCount = { value: 0 };
      nonInteractiveDiv.addEventListener('click', () => clickCount.value++);

      nonInteractiveDiv.dispatchEvent(
        new MouseEvent('click', { bubbles: true, clientX: 200, clientY: 200 }),
      );

      // Only the original user click fires — no synthetic click from proximity logic
      expect(clickCount.value).toBe(1);
      doc.body.removeChild(nonInteractiveDiv);
    });

    it('does nothing extra when an ancestor of the click target is interactive', () => {
      const button = doc.createElement('button');
      const span = doc.createElement('span');
      button.appendChild(span);
      doc.body.appendChild(button);
      const proximityClickSpy = spyOn(button, 'click');

      span.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));

      expect(proximityClickSpy).not.toHaveBeenCalled();
      doc.body.removeChild(button);
    });
  });

  describe('cleanup', () => {
    it('should remove the mousemove listener from the document on destroy', () => {
      const spy = spyOn(doc, 'removeEventListener').and.callThrough();
      fixture.destroy();
      expect(spy).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    });

    it('should remove the click listener from the document on destroy', () => {
      const spy = spyOn(doc, 'removeEventListener').and.callThrough();
      fixture.destroy();
      expect(spy).toHaveBeenCalledWith('click', jasmine.any(Function), { capture: true });
    });
  });
});
