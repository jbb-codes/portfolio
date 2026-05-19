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

describe('CustomCursorComponent – ring proximity', () => {
  let fixture: ComponentFixture<CustomCursorComponent>;
  let doc: Document;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(async () => {
    rafCallbacks = [];
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CustomCursorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCursorComponent);
    doc = TestBed.inject(DOCUMENT);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function tickRaf(): void {
    const cbs = [...rafCallbacks];
    rafCallbacks.length = 0;
    cbs.forEach(cb => cb(performance.now()));
  }

  describe('interactive ring detection', () => {
    it('applies --on-interactive state when ring edge is over an interactive element', () => {
      const button = doc.createElement('button');
      doc.body.appendChild(button);
      spyOn(doc, 'elementFromPoint').and.returnValue(button);

      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();

      const dot: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      const ring: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-ring"]');
      expect(dot.classList).toContain('custom-cursor__dot--on-interactive');
      expect(ring.classList).toContain('custom-cursor__ring--on-interactive');

      doc.body.removeChild(button);
    });

    it('clears --on-interactive when ring moves away and dot is not over interactive element', () => {
      const button = doc.createElement('button');
      const div = doc.createElement('div');
      doc.body.appendChild(button);
      doc.body.appendChild(div);

      const fromPointSpy = spyOn(doc, 'elementFromPoint').and.returnValue(button);
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();

      fromPointSpy.and.returnValue(div);
      div.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }));
      tickRaf();

      const dot: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-dot"]');
      const ring: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cursor-ring"]');
      expect(dot.classList).not.toContain('custom-cursor__dot--on-interactive');
      expect(ring.classList).not.toContain('custom-cursor__ring--on-interactive');

      doc.body.removeChild(button);
      doc.body.removeChild(div);
    });
  });

  describe('hoverable element detection', () => {
    it('adds cursor-ring-active to a [data-cursor-hover] element when ring edge touches it', () => {
      const card = doc.createElement('div');
      card.setAttribute('data-cursor-hover', '');
      doc.body.appendChild(card);
      spyOn(doc, 'elementFromPoint').and.returnValue(card);

      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();

      expect(card.classList).toContain('cursor-ring-active');

      doc.body.removeChild(card);
    });

    it('adds cursor-ring-active to a [data-cursor-hover] ancestor when a child is at the ring edge', () => {
      const card = doc.createElement('div');
      card.setAttribute('data-cursor-hover', '');
      const inner = doc.createElement('p');
      card.appendChild(inner);
      doc.body.appendChild(card);
      spyOn(doc, 'elementFromPoint').and.returnValue(inner);

      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();

      expect(card.classList).toContain('cursor-ring-active');

      doc.body.removeChild(card);
    });

    it('removes cursor-ring-active when ring moves away from the hoverable element', () => {
      const card = doc.createElement('div');
      card.setAttribute('data-cursor-hover', '');
      const elsewhere = doc.createElement('div');
      doc.body.appendChild(card);
      doc.body.appendChild(elsewhere);

      const fromPointSpy = spyOn(doc, 'elementFromPoint').and.returnValue(card);
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();

      fromPointSpy.and.returnValue(elsewhere);
      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }));
      tickRaf();

      expect(card.classList).not.toContain('cursor-ring-active');

      doc.body.removeChild(card);
      doc.body.removeChild(elsewhere);
    });
  });

  describe('cleanup on destroy', () => {
    it('removes cursor-ring-active from all active elements when component is destroyed', () => {
      const card = doc.createElement('div');
      card.setAttribute('data-cursor-hover', '');
      doc.body.appendChild(card);
      spyOn(doc, 'elementFromPoint').and.returnValue(card);

      doc.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      tickRaf();
      expect(card.classList).toContain('cursor-ring-active');

      fixture.destroy();
      expect(card.classList).not.toContain('cursor-ring-active');

      doc.body.removeChild(card);
    });
  });
});
