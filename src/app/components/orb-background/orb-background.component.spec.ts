import { TestBed } from '@angular/core/testing';
import {
  ORB_RADIUS_PX,
  OrbState,
  resolveOrbCollisions,
  stepOrb,
  OrbBackgroundComponent,
} from './orb-background.component';

describe('resolveOrbCollisions', () => {
  // 1000x1000 keeps vw === vh === 10px per unit, simplifying distance math.
  const VIEWPORT_WIDTH = 1000;
  const VIEWPORT_HEIGHT = 1000;

  it('returns unchanged states when orbs are far apart', () => {
    const orb1: OrbState = { left: 10, top: 50, driftX: 0.1, driftY: 0 };
    const orb2: OrbState = { left: 90, top: 50, driftX: -0.1, driftY: 0 };
    const [next1, next2] = resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(next1).toEqual(orb1);
    expect(next2).toEqual(orb2);
  });

  it('reverses both drift vectors when orbs overlap', () => {
    // Centers at x=400 and x=600 → distance=200 < 400 (diameter)
    const orb1: OrbState = { left: 40, top: 50, driftX: 0.1, driftY: 0.05 };
    const orb2: OrbState = { left: 60, top: 50, driftX: -0.1, driftY: -0.05 };
    const [next1, next2] = resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(next1.driftX).toBe(-orb1.driftX);
    expect(next1.driftY).toBe(-orb1.driftY);
    expect(next2.driftX).toBe(-orb2.driftX);
    expect(next2.driftY).toBe(-orb2.driftY);
  });

  it('does not trigger when orbs are exactly at the collision boundary', () => {
    // Centers at x=300 and x=700 → distance=400 === diameter, no bounce
    const orb1: OrbState = { left: 30, top: 50, driftX: 0.1, driftY: 0 };
    const orb2: OrbState = { left: 70, top: 50, driftX: -0.1, driftY: 0 };
    const [next1, next2] = resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(next1.driftX).toBe(orb1.driftX);
    expect(next2.driftX).toBe(orb2.driftX);
  });

  it('triggers when orbs are just inside the collision distance', () => {
    // Centers at x=301 and x=699 → distance=398 < 400 (diameter), should bounce
    const orb1: OrbState = { left: 30.1, top: 50, driftX: 0.1, driftY: 0 };
    const orb2: OrbState = { left: 69.9, top: 50, driftX: -0.1, driftY: 0 };
    const [next1, next2] = resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(next1.driftX).toBe(-orb1.driftX);
    expect(next2.driftX).toBe(-orb2.driftX);
  });

  it('does not reverse drift when orbs overlap but are already moving apart', () => {
    // Centers at x=400 and x=600 → within collision range, but drifting away from each other
    const orb1: OrbState = { left: 40, top: 50, driftX: -0.1, driftY: 0 };
    const orb2: OrbState = { left: 60, top: 50, driftX: 0.1, driftY: 0 };
    const [next1, next2] = resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(next1.driftX).toBe(orb1.driftX);
    expect(next2.driftX).toBe(orb2.driftX);
  });

  it('does not mutate either input', () => {
    const orb1: OrbState = { left: 40, top: 50, driftX: 0.1, driftY: 0 };
    const orb2: OrbState = { left: 60, top: 50, driftX: -0.1, driftY: 0 };
    const snap1 = { ...orb1 };
    const snap2 = { ...orb2 };
    resolveOrbCollisions(orb1, orb2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    expect(orb1).toEqual(snap1);
    expect(orb2).toEqual(snap2);
  });
});

describe('stepOrb', () => {
  // 1000x1000 viewport: left/top bound = -ORB_RADIUS_PX/1000*100 = -20
  //                    right/bottom bound = (1000-ORB_RADIUS_PX)/1000*100 = 80
  const VW = 1000;
  const VH = 1000;

  it('advances position by drift amount', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.left).toBeCloseTo(10.5);
    expect(next.top).toBeCloseTo(20.3);
  });

  // contract: immutability
  it('does not mutate the input', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const snapshot = { ...orb };
    stepOrb(orb, 1, VW, VH);
    expect(orb).toEqual(snapshot);
  });

  it('bounces off the left wall and clamps position', () => {
    const orb: OrbState = { left: -19.6, top: 30, driftX: -0.5, driftY: 0 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftX).toBeGreaterThan(0);
    expect(next.left).toBeCloseTo(-ORB_RADIUS_PX / VW * 100);
  });

  it('bounces off the right wall and clamps position', () => {
    const orb: OrbState = { left: 79.6, top: 30, driftX: 0.5, driftY: 0 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftX).toBeLessThan(0);
    expect(next.left).toBeCloseTo((VW - ORB_RADIUS_PX) / VW * 100);
  });

  it('bounces off the top wall and clamps position', () => {
    const orb: OrbState = { left: 30, top: -19.6, driftX: 0, driftY: -0.5 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftY).toBeGreaterThan(0);
    expect(next.top).toBeCloseTo(-ORB_RADIUS_PX / VH * 100);
  });

  it('bounces off the bottom wall and clamps position', () => {
    const orb: OrbState = { left: 30, top: 79.6, driftX: 0, driftY: 0.5 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftY).toBeLessThan(0);
    expect(next.top).toBeCloseTo((VH - ORB_RADIUS_PX) / VH * 100);
  });

  it('preserves drift when not hitting a wall', () => {
    const orb: OrbState = { left: 30, top: 30, driftX: 0.5, driftY: -0.3 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftX).toBe(0.5);
    expect(next.driftY).toBe(-0.3);
  });

  it('scales movement proportionally when deltaScale is 2', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const single = stepOrb(orb, 1, VW, VH);
    const doubled = stepOrb(orb, 2, VW, VH);
    expect(doubled.left).toBeCloseTo(single.left + 0.5);
    expect(doubled.top).toBeCloseTo(single.top + 0.3);
  });

  it('does not move when deltaScale is 0', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const next = stepOrb(orb, 0, VW, VH);
    expect(next.left).toBeCloseTo(10);
    expect(next.top).toBeCloseTo(20);
  });

  it('adapts right bound to a wider viewport', () => {
    // 2000x1000: right bound = (2000-200)/2000*100 = 90
    const orb: OrbState = { left: 89.6, top: 30, driftX: 0.5, driftY: 0 };
    const next = stepOrb(orb, 1, 2000, 1000);
    expect(next.driftX).toBeLessThan(0);
    expect(next.left).toBeCloseTo((2000 - ORB_RADIUS_PX) / 2000 * 100);
  });

  it('does not bounce before the viewport-aware right bound', () => {
    // 1000x1000: right bound = 80. Position 70.5 is past old static bound (70) but inside new bound.
    const orb: OrbState = { left: 70.5, top: 30, driftX: 0.5, driftY: 0 };
    const next = stepOrb(orb, 1, VW, VH);
    expect(next.driftX).toBeGreaterThan(0);
  });
});

describe('OrbBackgroundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbBackgroundComponent],
    }).compileComponents();
  });

  describe('without reduced motion', () => {
    it('renders exactly two orb elements', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      const orbs = fixture.nativeElement.querySelectorAll('[data-testid="orb"]');
      expect(orbs.length).toBe(2);
      fixture.destroy();
    });

    it('starts a requestAnimationFrame loop', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      const rafSpy = spyOn(window, 'requestAnimationFrame').and.returnValue(1);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      expect(rafSpy).toHaveBeenCalled();
      fixture.destroy();
    });

    it('cancels the animation frame on destroy', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      spyOn(window, 'requestAnimationFrame').and.returnValue(42);
      const cancelSpy = spyOn(window, 'cancelAnimationFrame');
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      fixture.destroy();
      expect(cancelSpy).toHaveBeenCalledWith(42);
    });
  });

  describe('with reduced motion', () => {
    it('renders exactly two orb elements', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      const orbs = fixture.nativeElement.querySelectorAll('[data-testid="orb"]');
      expect(orbs.length).toBe(2);
      fixture.destroy();
    });

    it('does not start a requestAnimationFrame loop', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      const rafSpy = spyOn(window, 'requestAnimationFrame');
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      expect(rafSpy).not.toHaveBeenCalled();
      fixture.destroy();
    });
  });
});
