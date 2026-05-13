import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ParticleBackgroundComponent } from './particle-background.component';

describe('ParticleBackgroundComponent', () => {
  let fixture: ComponentFixture<ParticleBackgroundComponent>;
  let component: ParticleBackgroundComponent;
  let win: Window & typeof globalThis;
  let mockResizeObserver: { observe: jasmine.Spy; disconnect: jasmine.Spy };
  let originalResizeObserver: typeof ResizeObserver;

  const mockCtx = {
    clearRect: jasmine.createSpy('clearRect'),
    beginPath: jasmine.createSpy('beginPath'),
    arc: jasmine.createSpy('arc'),
    fill: jasmine.createSpy('fill'),
    fillStyle: '',
  };

  beforeEach(async () => {
    originalResizeObserver = window.ResizeObserver;
    mockResizeObserver = { observe: jasmine.createSpy('observe'), disconnect: jasmine.createSpy('disconnect') };
    (window as unknown as Record<string, unknown>)['ResizeObserver'] = jasmine.createSpy('ResizeObserver').and.returnValue(mockResizeObserver);

    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(mockCtx as unknown as CanvasRenderingContext2D);
    spyOn(window, 'requestAnimationFrame').and.returnValue(42);
    spyOn(window, 'cancelAnimationFrame');
    // matches: true → '(prefers-reduced-motion: no-preference)' matches → animate
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
    it('should start the animation loop on init when motion is allowed', () => {
      expect(win.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should cancel the animation frame on destroy using the stored ID', () => {
      fixture.destroy();
      expect(win.cancelAnimationFrame).toHaveBeenCalledWith(42);
    });
  });

  describe('resize handling', () => {
    it('should observe the canvas element via ResizeObserver on init', () => {
      const canvas = fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(canvas);
    });

    it('should disconnect the ResizeObserver on destroy', () => {
      fixture.destroy();
      expect(mockResizeObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('drawing', () => {
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
      // matches: false → '(prefers-reduced-motion: no-preference)' does not match → reduced motion
      (win.matchMedia as jasmine.Spy).and.returnValue({ matches: false } as MediaQueryList);
      (win.requestAnimationFrame as jasmine.Spy).calls.reset();

      const reducedFixture = TestBed.createComponent(ParticleBackgroundComponent);
      reducedFixture.detectChanges();

      expect(win.requestAnimationFrame).not.toHaveBeenCalled();
      reducedFixture.destroy();
    });
  });
});
