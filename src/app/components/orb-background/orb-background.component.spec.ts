import { TestBed } from '@angular/core/testing';
import {
  ORB_RANGE_MAX,
  ORB_RANGE_MIN,
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
  it('advances position by drift amount', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const next = stepOrb(orb);
    expect(next.left).toBeCloseTo(10.5);
    expect(next.top).toBeCloseTo(20.3);
  });

  it('does not mutate the input', () => {
    const orb: OrbState = { left: 10, top: 20, driftX: 0.5, driftY: 0.3 };
    const snapshot = { ...orb };
    stepOrb(orb);
    expect(orb).toEqual(snapshot);
  });

  it('bounces off the left wall and clamps left', () => {
    const orb: OrbState = { left: -9.8, top: 30, driftX: -0.5, driftY: 0 };
    const next = stepOrb(orb);
    expect(next.driftX).toBeGreaterThan(0);
    expect(next.left).toBe(ORB_RANGE_MIN);
  });

  it('bounces off the right wall and clamps left', () => {
    const orb: OrbState = { left: 69.8, top: 30, driftX: 0.5, driftY: 0 };
    const next = stepOrb(orb);
    expect(next.driftX).toBeLessThan(0);
    expect(next.left).toBe(ORB_RANGE_MAX);
  });

  it('bounces off the top wall and clamps top', () => {
    const orb: OrbState = { left: 30, top: -9.8, driftX: 0, driftY: -0.5 };
    const next = stepOrb(orb);
    expect(next.driftY).toBeGreaterThan(0);
    expect(next.top).toBe(ORB_RANGE_MIN);
  });

  it('bounces off the bottom wall and clamps top', () => {
    const orb: OrbState = { left: 30, top: 69.8, driftX: 0, driftY: 0.5 };
    const next = stepOrb(orb);
    expect(next.driftY).toBeLessThan(0);
    expect(next.top).toBe(ORB_RANGE_MAX);
  });

  it('preserves drift when not hitting a wall', () => {
    const orb: OrbState = { left: 30, top: 30, driftX: 0.5, driftY: -0.3 };
    const next = stepOrb(orb);
    expect(next.driftX).toBe(0.5);
    expect(next.driftY).toBe(-0.3);
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
