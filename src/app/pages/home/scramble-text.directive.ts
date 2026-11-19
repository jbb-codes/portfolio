import {
  Directive,
  ElementRef,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface ScrambleClock {
  setInterval(callback: () => void, delayMs: number): unknown;
  clearInterval(handle: unknown): void;
}

export const SCRAMBLE_CLOCK = new InjectionToken<ScrambleClock>(
  'SCRAMBLE_CLOCK',
  {
    providedIn: 'root',
    factory: () => ({
      setInterval: (callback, delayMs) => setInterval(callback, delayMs),
      clearInterval: (handle) =>
        clearInterval(handle as ReturnType<typeof setInterval>),
    }),
  },
);

export const SCRAMBLE_RANDOM = new InjectionToken<() => number>(
  'SCRAMBLE_RANDOM',
  { providedIn: 'root', factory: () => Math.random },
);

const TICK_MS = 50;
// Every letter cycles through random characters for a moment before the
// first one locks, then locks are spread evenly across the remaining ticks.
const WARMUP_TICKS = 4;
const LOCK_TICKS = 24;
const CHARACTER_POOL =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

interface Cell {
  readonly finalCharacter: string;
  readonly live: HTMLElement;
  readonly lockTick: number;
}

// Decodes a phrase: every letter shows random characters, then locks to the
// correct letter in random order. Each letter keeps the width of its final
// character, so the phrase never reflows while it scrambles.
@Directive({
  selector: '[appScrambleText]',
  standalone: true,
})
export class ScrambleTextDirective implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'appScrambleText' }) text = '';

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly clock = inject(SCRAMBLE_CLOCK);
  private readonly random = inject(SCRAMBLE_RANDOM);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private cells: Cell[] = [];
  private tickCount = 0;
  private timerHandle: unknown = null;

  ngOnInit(): void {
    // appendChild, not append(): the server DOM implementation lacks append().
    const element = this.host.nativeElement;
    // Hydration reuses the server-rendered markup, which already holds the
    // generated nodes; start clean so they are not duplicated.
    element.textContent = '';
    element.appendChild(this.buildAccessibleText());
    element.appendChild(this.buildVisual());

    if (!this.isBrowser || this.prefersReducedMotion()) return;

    this.renderTick();
    this.timerHandle = this.clock.setInterval(() => this.tick(), TICK_MS);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private tick(): void {
    this.tickCount++;
    this.renderTick();

    const lastLockTick = Math.max(...this.cells.map((cell) => cell.lockTick));
    if (this.tickCount >= lastLockTick) this.stop();
  }

  private renderTick(): void {
    for (const cell of this.cells) {
      cell.live.textContent =
        this.tickCount >= cell.lockTick
          ? cell.finalCharacter
          : this.randomCharacterOtherThan(cell.finalCharacter);
    }
  }

  private stop(): void {
    if (this.timerHandle === null) return;
    this.clock.clearInterval(this.timerHandle);
    this.timerHandle = null;
  }

  // Never equal to the final letter, so a letter only reads as correct once
  // it has really locked.
  private randomCharacterOtherThan(excluded: string): string {
    const index = Math.floor(this.random() * CHARACTER_POOL.length);
    const candidate = CHARACTER_POOL[index];
    return candidate === excluded
      ? CHARACTER_POOL[(index + 1) % CHARACTER_POOL.length]
      : candidate;
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private buildAccessibleText(): HTMLElement {
    const accessible = this.document.createElement('span');
    accessible.setAttribute('data-testid', 'scramble-accessible');
    accessible.textContent = this.text;
    // Visually hidden but still read aloud.
    Object.assign(accessible.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
    });
    return accessible;
  }

  private buildVisual(): HTMLElement {
    const visual = this.document.createElement('span');
    visual.setAttribute('data-testid', 'scramble-visual');
    visual.setAttribute('aria-hidden', 'true');

    const lockTicks = this.assignLockTicks();
    this.cells = [];

    // Cells are inline-blocks, which would otherwise allow a line break
    // between any two letters. Each word is kept unbreakable instead.
    let word: HTMLElement | null = null;

    Array.from(this.text).forEach((character, index) => {
      if (character === ' ') {
        word = null;
        visual.appendChild(this.document.createTextNode(' '));
        return;
      }
      if (!word) {
        word = this.document.createElement('span');
        word.setAttribute('data-testid', 'scramble-word');
        word.style.display = 'inline-block';
        word.style.whiteSpace = 'nowrap';
        visual.appendChild(word);
      }
      const { slot, cell } = this.buildCell(character, lockTicks.get(index)!);
      this.cells.push(cell);
      word.appendChild(slot);
    });
    return visual;
  }

  private buildCell(
    finalCharacter: string,
    lockTick: number,
  ): { slot: HTMLElement; cell: Cell } {
    const slot = this.document.createElement('span');
    slot.setAttribute('data-testid', 'scramble-cell');
    slot.style.position = 'relative';
    slot.style.display = 'inline-block';

    // The hidden copy reserves the final letter's width; the live copy is
    // overlaid and centred so wider random glyphs cannot push neighbours.
    const sizer = this.document.createElement('span');
    sizer.style.visibility = 'hidden';
    sizer.textContent = finalCharacter;

    const live = this.document.createElement('span');
    live.setAttribute('data-testid', 'scramble-live');
    live.textContent = finalCharacter;
    Object.assign(live.style, {
      position: 'absolute',
      inset: '0',
      textAlign: 'center',
    });

    slot.appendChild(sizer);
    slot.appendChild(live);
    return { slot, cell: { finalCharacter, live, lockTick } };
  }

  private assignLockTicks(): Map<number, number> {
    const positions = Array.from(this.text)
      .map((character, index) => (character === ' ' ? -1 : index))
      .filter((index) => index >= 0);

    // Fisher-Yates: O(n) unbiased shuffle gives the random lock order.
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    return new Map(
      positions.map((position, order) => [
        position,
        WARMUP_TICKS + Math.floor((order * LOCK_TICKS) / positions.length),
      ]),
    );
  }
}
