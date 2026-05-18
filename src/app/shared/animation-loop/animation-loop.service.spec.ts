import { TestBed } from '@angular/core/testing';
import { AnimationLoopService } from './animation-loop.service';

describe('AnimationLoopService', () => {
  let service: AnimationLoopService;
  let scheduledFrames: Map<number, FrameRequestCallback>;
  let nextRafId: number;
  let matchMediaResult: { matches: boolean };

  function flushFrames(count: number): void {
    Array.from({ length: count }).forEach(() => {
      if (scheduledFrames.size === 0) return;
      const [[id, cb]] = scheduledFrames;
      scheduledFrames.delete(id);
      cb(0);
    });
  }

  beforeEach(() => {
    nextRafId = 0;
    scheduledFrames = new Map();
    matchMediaResult = { matches: true };

    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      const id = ++nextRafId;
      scheduledFrames.set(id, cb);
      return id;
    });

    spyOn(window, 'cancelAnimationFrame').and.callFake((id: number) => {
      scheduledFrames.delete(id);
    });

    spyOn(window, 'matchMedia').and.callFake(() => matchMediaResult as MediaQueryList);

    TestBed.configureTestingModule({ providers: [AnimationLoopService] });
    service = TestBed.inject(AnimationLoopService);
  });

  afterEach(() => service.ngOnDestroy());

  describe('when prefers-reduced-motion is active', () => {
    beforeEach(() => {
      matchMediaResult.matches = false;
    });

    it('never calls draw', () => {
      const draw = jasmine.createSpy('draw');
      service.start(draw);

      flushFrames(3);

      expect(draw).not.toHaveBeenCalled();
    });
  });

  describe('when prefers-reduced-motion is not active', () => {
    it('calls draw on each frame', () => {
      const draw = jasmine.createSpy('draw');
      service.start(draw);

      flushFrames(3);

      expect(draw).toHaveBeenCalledTimes(3);
    });
  });

  describe('stop()', () => {
    it('draw is not called after stop', () => {
      const draw = jasmine.createSpy('draw');
      service.start(draw);

      flushFrames(2);
      service.stop();
      flushFrames(5);

      expect(draw).toHaveBeenCalledTimes(2);
    });

    it('does not throw when no loop is running', () => {
      expect(() => service.stop()).not.toThrow();
    });
  });

  describe('ngOnDestroy()', () => {
    it('draw is not called after destroy', () => {
      const draw = jasmine.createSpy('draw');
      service.start(draw);

      flushFrames(2);
      service.ngOnDestroy();
      flushFrames(5);

      expect(draw).toHaveBeenCalledTimes(2);
    });

    it('does not throw when no loop is running', () => {
      expect(() => service.ngOnDestroy()).not.toThrow();
    });
  });
});
