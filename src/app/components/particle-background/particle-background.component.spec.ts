import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ParticleBackgroundComponent } from './particle-background.component';

describe('ParticleBackgroundComponent', () => {
  let fixture: ComponentFixture<ParticleBackgroundComponent>;
  let component: ParticleBackgroundComponent;
  let win: Window & typeof globalThis;
  let mockResizeObserver: { observe: jasmine.Spy; disconnect: jasmine.Spy };
  let originalResizeObserver: typeof ResizeObserver;
  let resizeCallback: (entries: Partial<ResizeObserverEntry>[]) => void;

  let mockMutationObserver: { observe: jasmine.Spy; disconnect: jasmine.Spy };
  let originalMutationObserver: typeof MutationObserver;
  let mutationCallback: () => void;

  const mockCtx = {
    clearRect: jasmine.createSpy('clearRect'),
    beginPath: jasmine.createSpy('beginPath'),
    arc: jasmine.createSpy('arc'),
    fill: jasmine.createSpy('fill'),
    stroke: jasmine.createSpy('stroke'),
    save: jasmine.createSpy('save'),
    restore: jasmine.createSpy('restore'),
    scale: jasmine.createSpy('scale'),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
  };

  beforeEach(async () => {
    originalResizeObserver = window.ResizeObserver;
    mockResizeObserver = { observe: jasmine.createSpy('observe'), disconnect: jasmine.createSpy('disconnect') };

    const capturedMockResizeObserver = mockResizeObserver;
    function MockResizeObserver(cb: (entries: Partial<ResizeObserverEntry>[]) => void) {
      resizeCallback = cb;
      return capturedMockResizeObserver;
    }
    MockResizeObserver.prototype = {};
    (window as unknown as Record<string, unknown>)['ResizeObserver'] = MockResizeObserver;

    originalMutationObserver = window.MutationObserver;
    mockMutationObserver = { observe: jasmine.createSpy('observe'), disconnect: jasmine.createSpy('disconnect') };

    const capturedMockMutationObserver = mockMutationObserver;
    function MockMutationObserver(cb: () => void) {
      mutationCallback = cb;
      return capturedMockMutationObserver;
    }
    MockMutationObserver.prototype = {};
    (window as unknown as Record<string, unknown>)['MutationObserver'] = MockMutationObserver;

    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(mockCtx as unknown as CanvasRenderingContext2D);
    spyOn(window, 'requestAnimationFrame').and.returnValue(42);
    spyOn(window, 'cancelAnimationFrame');
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    await TestBed.configureTestingModule({
      imports: [ParticleBackgroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticleBackgroundComponent);
    component = fixture.componentInstance;
    win = TestBed.inject(DOCUMENT).defaultView as Window & typeof globalThis;
    fixture.detectChanges();
  });

  afterEach(() => {
    (window as unknown as Record<string, unknown>)['ResizeObserver'] = originalResizeObserver;
    (window as unknown as Record<string, unknown>)['MutationObserver'] = originalMutationObserver;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('canvas element', () => {
    it('should render a canvas element', () => {
      const canvas = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      expect(canvas).toBeTruthy();
    });

    it('should mark the canvas as aria-hidden', () => {
      const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      expect(canvas.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('animation loop', () => {
    it('draws to the canvas when motion is allowed', () => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: true } as MediaQueryList);

      let callCount = 0;
      let capturedCallback: FrameRequestCallback | undefined;
      (win.requestAnimationFrame as jasmine.Spy).and.callFake((cb: FrameRequestCallback) => {
        if (callCount++ === 0) capturedCallback = cb;
        return 99;
      });

      mockCtx.clearRect.calls.reset();

      const motionFixture = TestBed.createComponent(ParticleBackgroundComponent);
      motionFixture.detectChanges();

      capturedCallback!(performance.now());

      expect(mockCtx.clearRect).toHaveBeenCalled();
      motionFixture.destroy();
    });
  });

  describe('resize handling', () => {
    it('does not apply a pending resize after destroy', fakeAsync(() => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
      const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');

      resizeCallback([{ contentRect: { width: 999, height: 999 } } as unknown as ResizeObserverEntry]);

      fixture.destroy();
      tick(200);

      expect(canvas.width).not.toBe(999);
    }));

    it('sizes the canvas from window.innerWidth and window.innerHeight on init', () => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

      const initFixture = TestBed.createComponent(ParticleBackgroundComponent);
      initFixture.detectChanges();

      const canvas: HTMLCanvasElement = initFixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      expect(canvas.width).toBe(1200);
      expect(canvas.height).toBe(800);

      initFixture.destroy();
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
    });

    it('sets canvas physical dimensions to logical dimensions multiplied by the pixel scale', () => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');

      (component as any).resizeCanvas(800, 600);

      expect(canvas.width).toBe(1600);
      expect(canvas.height).toBe(1200);

      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    });

    it('debounces resize observer callbacks to prevent thrashing', fakeAsync(() => {
      const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      const initialWidth = canvas.width;

      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

      resizeCallback([{ contentRect: { width: 500, height: 400 } } as unknown as ResizeObserverEntry]);
      resizeCallback([{ contentRect: { width: 600, height: 500 } } as unknown as ResizeObserverEntry]);
      resizeCallback([{ contentRect: { width: 700, height: 600 } } as unknown as ResizeObserverEntry]);

      expect(canvas.width).toBe(initialWidth);

      tick(100);

      expect(canvas.width).toBe(700);
      expect(canvas.height).toBe(600);
    }));

    it('applies only the last resize when rapid events arrive before debounce settles', fakeAsync(() => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

      resizeCallback([{ contentRect: { width: 300, height: 200 } } as unknown as ResizeObserverEntry]);
      tick(50);
      resizeCallback([{ contentRect: { width: 800, height: 700 } } as unknown as ResizeObserverEntry]);
      tick(100);

      const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(700);
    }));
  });

  describe('drawing', () => {
    it('clears the full physical canvas before drawing new content', () => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      (component as any).resizeCanvas(400, 300);
      mockCtx.clearRect.calls.reset();

      (component as any).draw();

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);

      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    });

    it('reads dot color from the --particle-color CSS variable', () => {
      const expectedColor = 'rgba(64, 56, 200, 0.5)';
      spyOn(window, 'getComputedStyle').and.returnValue({
        getPropertyValue: (prop: string) => prop === '--particle-color' ? expectedColor : '',
      } as CSSStyleDeclaration);

      (component as any).draw();

      expect(mockCtx.fillStyle).toBe(expectedColor);
    });
  });

  describe('prefers-reduced-motion', () => {
    it('should not start the animation loop when no-preference does not match', () => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);
      (win.requestAnimationFrame as jasmine.Spy).calls.reset();

      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      expect(win.requestAnimationFrame).not.toHaveBeenCalled();
      reducedFixture.destroy();
    });

    it('draws particles statically on init when reduced motion is preferred', () => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);
      mockCtx.clearRect.calls.reset();
      mockCtx.arc.calls.reset();

      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      expect(mockCtx.clearRect).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
      reducedFixture.destroy();
    });

    it('redraws particles statically after resize when reduced motion is preferred', fakeAsync(() => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);

      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      mockCtx.clearRect.calls.reset();
      mockCtx.arc.calls.reset();

      resizeCallback([{ contentRect: { width: 1024, height: 768 } } as unknown as ResizeObserverEntry]);
      tick(100);

      expect(mockCtx.clearRect).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
      reducedFixture.destroy();
    }));

    it('redraws particles statically when the theme changes while reduced motion is preferred', () => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);

      mockCtx.arc.calls.reset();
      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      mockCtx.arc.calls.reset();
      mutationCallback();

      expect(mockCtx.arc).toHaveBeenCalled();
      reducedFixture.destroy();
    });

    it('draws particles at the same positions after resize when reduced motion is preferred', fakeAsync(() => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

      mockCtx.arc.calls.reset();
      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      const initialArcCalls = mockCtx.arc.calls.allArgs();
      mockCtx.arc.calls.reset();

      resizeCallback([{ contentRect: { width: 1000, height: 800 } } as unknown as ResizeObserverEntry]);
      tick(100);

      expect(mockCtx.arc.calls.allArgs()).toEqual(initialArcCalls);
      reducedFixture.destroy();
    }));
  });

  describe('pulse on background click', () => {
    beforeEach(() => {
      mockCtx.stroke.calls.reset();
      mockCtx.save.calls.reset();
      mockCtx.restore.calls.reset();
    });

    it('does not emit a pulse ring without a click', () => {
      (component as any).draw();
      (component as any).draw();

      expect(mockCtx.stroke).not.toHaveBeenCalled();
    });

    it('creates a pulse only when the background is clicked', () => {
      expect((component as any).pulses.length).toBe(0);

      document.body.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 200, clientY: 150 }),
      );

      expect((component as any).pulses.length).toBe(1);
      expect((component as any).pulses[0].x).toBe(200);
      expect((component as any).pulses[0].y).toBe(150);
    });

    it('does not create a pulse when clicking a button', () => {
      const buttonEl = document.createElement('button');
      document.body.appendChild(buttonEl);

      buttonEl.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }),
      );

      expect((component as any).pulses.length).toBe(0);
      document.body.removeChild(buttonEl);
    });

    it('does not create a pulse when clicking a link', () => {
      const linkEl = document.createElement('a');
      document.body.appendChild(linkEl);

      linkEl.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }),
      );

      expect((component as any).pulses.length).toBe(0);
      document.body.removeChild(linkEl);
    });

    it('draws the expanding pulse ring on the canvas after a click', () => {
      (component as any).triggerPulse(200, 150);
      mockCtx.stroke.calls.reset();

      (component as any).updateAndDrawPulses(mockCtx, 1, 'white');

      expect(mockCtx.stroke).toHaveBeenCalled();
    });

    it('removes the pulse after it has fully expanded', () => {
      (component as any).pulses = [{ x: 100, y: 100, radius: 295, alpha: 0.02 }];

      (component as any).updateAndDrawPulses(mockCtx, 1, 'white');

      expect((component as any).pulses.length).toBe(0);
    });

    it('does not add a click listener when reduced motion is preferred', () => {
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);
      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      document.body.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }),
      );

      expect((reducedFixture.componentInstance as any).pulses.length).toBe(0);
      reducedFixture.destroy();
    });
  });

  describe('particle destruction', () => {
    it('immediately destroys dots inside the cursor ring at click time', () => {
      (component as any).dots = [
        { positionX: 100, positionY: 100, velocityX: 0, velocityY: 0 },
        { positionX: 500, positionY: 500, velocityX: 0, velocityY: 0 },
      ];

      (component as any).triggerPulse(100, 100);

      expect((component as any).dots.length).toBe(1);
      expect((component as any).shards.length).toBeGreaterThan(0);
    });

    it('destroys a dot when the expanding pulse ring sweeps through it', () => {
      (component as any).dots = [{ positionX: 97, positionY: 0, velocityX: 0, velocityY: 0 }];
      (component as any).pulses = [{ x: 0, y: 0, radius: 94, alpha: 0.8 }];

      (component as any).updateAndDrawPulses(mockCtx, 1, 'white');

      expect((component as any).dots.length).toBe(0);
      expect((component as any).shards.length).toBeGreaterThan(0);
    });

    it('does not destroy a dot that the pulse has already passed', () => {
      (component as any).dots = [{ positionX: 50, positionY: 0, velocityX: 0, velocityY: 0 }];
      (component as any).pulses = [{ x: 0, y: 0, radius: 80, alpha: 0.7 }];

      (component as any).updateAndDrawPulses(mockCtx, 1, 'white');

      expect((component as any).dots.length).toBe(1);
    });

    it('respawns a destroyed dot after the delay', fakeAsync(() => {
      (component as any).logicalWidth = 1000;
      (component as any).logicalHeight = 800;
      (component as any).dots = [{ positionX: 100, positionY: 100, velocityX: 0, velocityY: 0 }];

      (component as any).triggerPulse(100, 100);
      expect((component as any).dots.length).toBe(0);

      tick(2500);

      expect((component as any).dots.length).toBe(1);
    }));

    it('clears pending respawn timers on destroy', fakeAsync(() => {
      (component as any).logicalWidth = 1000;
      (component as any).logicalHeight = 800;
      (component as any).dots = [{ positionX: 100, positionY: 100, velocityX: 0, velocityY: 0 }];
      (component as any).triggerPulse(100, 100);

      fixture.destroy();
      tick(2500);
    }));
  });

  describe('shard animation', () => {
    it('spawns shards when a dot is destroyed', () => {
      (component as any).dots = [{ positionX: 100, positionY: 100, velocityX: 0, velocityY: 0 }];

      (component as any).triggerPulse(100, 100);

      expect((component as any).shards.length).toBeGreaterThan(0);
    });

    it('moves and fades shards each frame', () => {
      (component as any).shards = [
        { x: 100, y: 100, velocityX: 1, velocityY: 0, alpha: 0.5, size: 1 },
      ];

      (component as any).updateAndDrawShards(mockCtx, 1, 'white');

      const shard = (component as any).shards[0];
      expect(shard.x).toBeGreaterThan(100);
      expect(shard.alpha).toBeLessThan(0.5);
    });

    it('removes shards that have fully faded out', () => {
      (component as any).shards = [
        { x: 100, y: 100, velocityX: 1, velocityY: 0, alpha: 0.01, size: 1 },
      ];

      (component as any).updateAndDrawShards(mockCtx, 1, 'white');

      expect((component as any).shards.length).toBe(0);
    });
  });
});
