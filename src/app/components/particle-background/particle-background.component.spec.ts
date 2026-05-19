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

  const mockCtx = {
    clearRect: jasmine.createSpy('clearRect'),
    beginPath: jasmine.createSpy('beginPath'),
    arc: jasmine.createSpy('arc'),
    fill: jasmine.createSpy('fill'),
    scale: jasmine.createSpy('scale'),
    fillStyle: '',
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
  });
});
