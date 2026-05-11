import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  EXCLUSION_MAX,
  EXCLUSION_MIN,
  MOVE_INTERVAL_MAX,
  getRandomPosition,
  OrbBackgroundComponent,
} from './orb-background.component';

describe('getRandomPosition', () => {
  it('never returns a position inside the center exclusion zone across 1000 calls', () => {
    for (let i = 0; i < 1000; i++) {
      const { x, y } = getRandomPosition();
      const inExclusion =
        x >= EXCLUSION_MIN && x <= EXCLUSION_MAX && y >= EXCLUSION_MIN && y <= EXCLUSION_MAX;
      expect(inExclusion).withContext(`call ${i}: x=${x.toFixed(1)}, y=${y.toFixed(1)}`).toBeFalse();
    }
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

    it('updates orb positions after one interval elapses', fakeAsync(() => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      const initialOrb1 = { ...component.orb1 };
      tick(MOVE_INTERVAL_MAX + 1);
      fixture.destroy();
      expect(component.orb1).not.toEqual(initialOrb1);
    }));

    it('clears the timer on destroy', fakeAsync(() => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      fixture.detectChanges();
      const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();
      fixture.destroy();
      expect(clearSpy).toHaveBeenCalled();
    }));
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

    it('does not update orb positions after one interval elapses', fakeAsync(() => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      const fixture = TestBed.createComponent(OrbBackgroundComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      const initialOrb1 = { ...component.orb1 };
      tick(MOVE_INTERVAL_MAX + 1);
      fixture.detectChanges();
      expect(component.orb1).toEqual(initialOrb1);
      fixture.destroy();
    }));
  });
});
