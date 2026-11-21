import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SCRAMBLE_CLOCK,
  SCRAMBLE_RANDOM,
  ScrambleClock,
  ScrambleTextDirective,
} from './scramble-text.directive';

const PHRASE = 'Modern Software Developer';
const MAX_TICKS = 200;

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ScrambleTextDirective],
  template: `<span data-testid="host" [appScrambleText]="phrase"></span>`,
})
class TestHostComponent {
  phrase = PHRASE;
}

@Component({
  selector: 'prerendered-host',
  standalone: true,
  imports: [ScrambleTextDirective],
  template: `<span [appScrambleText]="phrase">server copy</span>`,
})
class PrerenderedHostComponent {
  phrase = PHRASE;
}

class FakeClock implements ScrambleClock {
  private callback: (() => void) | null = null;
  startCount = 0;

  setInterval(callback: () => void): unknown {
    this.callback = callback;
    this.startCount++;
    return 1;
  }

  clearInterval(): void {
    this.callback = null;
  }

  get isRunning(): boolean {
    return this.callback !== null;
  }

  tick(times = 1): void {
    for (let i = 0; i < times; i++) this.callback?.();
  }
}

// Small deterministic generator so each seed yields a different but
// repeatable lock order.
const seededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

describe('ScrambleTextDirective', () => {
  let clock: FakeClock;
  let matchMediaSpy: jasmine.Spy;

  const setup = (
    options: { seed?: number; platform?: string; reducedMotion?: boolean } = {},
  ): ComponentFixture<TestHostComponent> => {
    const { seed = 1, platform = 'browser', reducedMotion = false } = options;
    clock = new FakeClock();
    matchMediaSpy.and.returnValue({ matches: reducedMotion } as MediaQueryList);
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: SCRAMBLE_CLOCK, useValue: clock },
        { provide: SCRAMBLE_RANDOM, useValue: seededRandom(seed) },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    return fixture;
  };

  const host = (fixture: ComponentFixture<TestHostComponent>): HTMLElement =>
    fixture.nativeElement.querySelector('[data-testid="host"]');

  const accessibleText = (element: HTMLElement): string | undefined =>
    element
      .querySelector('[data-testid="scramble-accessible"]')
      ?.textContent?.trim();

  // Rebuilds the visible phrase: letters come from the live cells and word
  // gaps from the plain text nodes between them.
  const visibleText = (element: HTMLElement): string =>
    Array.from(
      element.querySelector('[data-testid="scramble-visual"]')!.childNodes,
    )
      .map((node) =>
        node.nodeType === Node.TEXT_NODE
          ? node.textContent
          : Array.from(
              (node as HTMLElement).querySelectorAll(
                '[data-testid="scramble-live"]',
              ),
            )
              .map((live) => live.textContent)
              .join(''),
      )
      .join('');

  const lockedPositions = (element: HTMLElement): number[] =>
    Array.from(visibleText(element))
      .map((char, index) => (char === PHRASE[index] ? index : -1))
      .filter((index) => index >= 0 && PHRASE[index] !== ' ');

  beforeEach(() => {
    matchMediaSpy = spyOn(window, 'matchMedia');
  });

  describe('accessibility and markup', () => {
    it('exposes the final phrase to assistive tech', () => {
      const element = host(setup());
      expect(accessibleText(element)).toBe(PHRASE);
    });

    it('keeps the accessible phrase unchanged while scrambling', () => {
      const element = host(setup());
      clock.tick(5);
      expect(accessibleText(element)).toBe(PHRASE);
    });

    it('keeps the accessible phrase out of the visual layout', () => {
      const accessible = host(setup()).querySelector<HTMLElement>(
        '[data-testid="scramble-accessible"]',
      )!;
      const box = accessible.getBoundingClientRect();
      expect(getComputedStyle(accessible).position).toBe('absolute');
      expect(box.width).toBeLessThanOrEqual(1);
      expect(box.height).toBeLessThanOrEqual(1);
    });

    it('hides the animated characters from assistive tech', () => {
      const element = host(setup());
      expect(
        element
          .querySelector('[data-testid="scramble-visual"]')
          ?.getAttribute('aria-hidden'),
      ).toBe('true');
    });

    it('only allows line breaks between words, never inside one', () => {
      const element = host(setup());
      const words = element.querySelectorAll('[data-testid="scramble-word"]');
      expect(words.length).toBe(3);
      words.forEach((word) =>
        expect(getComputedStyle(word).whiteSpace).toBe('nowrap'),
      );
      expect(visibleText(element)).toMatch(/^\S+ \S+ \S+$/);
    });
  });

  describe('scramble playback', () => {
    it('starts with the letters scrambled', () => {
      const element = host(setup());
      expect(lockedPositions(element).length).toBeLessThan(PHRASE.length / 2);
      expect(visibleText(element)).not.toBe(PHRASE);
    });

    it('ends on the exact phrase', () => {
      const element = host(setup());
      clock.tick(MAX_TICKS);
      expect(visibleText(element)).toBe(PHRASE);
    });

    it('stops its timer once the phrase is decoded and never restarts it', () => {
      const fixture = setup();
      clock.tick(MAX_TICKS);
      fixture.detectChanges();
      expect(clock.startCount).toBe(1);
      expect(clock.isRunning).toBeFalse();
    });

    it('never un-locks a letter once it is correct', () => {
      const element = host(setup());
      let previous = new Set<number>();
      for (let tick = 0; tick < MAX_TICKS; tick++) {
        clock.tick();
        const current = new Set(lockedPositions(element));
        previous.forEach((position) =>
          expect(current.has(position)).toBeTrue(),
        );
        previous = current;
      }
    });

    it('locks letters in a random order rather than left to right', () => {
      const element = host(setup({ seed: 7 }));
      let partial: number[] = [];
      for (let tick = 0; tick < MAX_TICKS && partial.length < 6; tick++) {
        clock.tick();
        partial = lockedPositions(element);
      }
      const sorted = [...partial].sort((a, b) => a - b);
      expect(sorted).not.toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('produces a different lock order for a different random source', () => {
      const orderFor = (seed: number): string => {
        const element = host(setup({ seed }));
        clock.tick(18);
        const order = lockedPositions(element).join(',');
        TestBed.resetTestingModule();
        return order;
      };
      expect(orderFor(3)).not.toBe(orderFor(11));
    });

    it('keeps the layout slot of every letter fixed while scrambling', () => {
      const element = host(setup());
      const widths = (): number[] =>
        Array.from(
          element.querySelectorAll('[data-testid="scramble-cell"]'),
        ).map((cell) => (cell as HTMLElement).offsetWidth);
      const before = widths();
      clock.tick(6);
      expect(widths()).toEqual(before);
    });
  });

  describe('reduced motion', () => {
    it('shows the final phrase immediately', () => {
      const element = host(setup({ reducedMotion: true }));
      expect(visibleText(element)).toBe(PHRASE);
    });

    it('never starts the timer', () => {
      setup({ reducedMotion: true });
      expect(clock.startCount).toBe(0);
    });
  });

  describe('server rendering', () => {
    it('replaces pre-rendered content instead of duplicating it', () => {
      TestBed.configureTestingModule({
        imports: [PrerenderedHostComponent],
        providers: [{ provide: SCRAMBLE_CLOCK, useValue: new FakeClock() }],
      });
      matchMediaSpy.and.returnValue({ matches: false } as MediaQueryList);
      const fixture = TestBed.createComponent(PrerenderedHostComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement.firstElementChild;
      expect(
        element.querySelectorAll('[data-testid="scramble-accessible"]').length,
      ).toBe(1);
      expect(element.textContent).not.toContain('server copy');
    });

    it('renders the final phrase without starting the timer', () => {
      const element = host(setup({ platform: 'server' }));
      expect(visibleText(element)).toBe(PHRASE);
      expect(accessibleText(element)).toBe(PHRASE);
      expect(clock.startCount).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('stops the timer when destroyed mid-scramble', () => {
      const fixture = setup();
      clock.tick(2);
      fixture.destroy();
      expect(clock.isRunning).toBeFalse();
    });
  });
});
