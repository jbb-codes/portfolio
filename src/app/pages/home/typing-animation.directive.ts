import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

const TYPING_INTERVAL_MS = 50;
const BLINK_INTERVAL_MS = 500;
const PAUSE_BLINK_COUNT = 3;

// Used Claude to help implement the typing animation directive as a state
// machine: type one character at a time → pause with blinking cursor →
// delete → advance to the next string, cycling until the last string is
// reached, which then blinks the cursor indefinitely.
@Directive({
  selector: '[appTypingAnimation]',
  standalone: true,
})
export class TypingAnimationDirective implements OnInit, OnDestroy {
  @Input() strings: string[] = [];

  private stringIndex = 0;
  private charIndex = 0;
  private blinkCount = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private textEl!: HTMLElement;
  private cursorEl!: HTMLElement;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.strings.length === 0) return;
    if (typeof document === 'undefined') return;

    const isReducedMotion =
      typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (isReducedMotion) {
      const textEl = document.createElement('span');
      textEl.setAttribute('data-testid', 'typing-text');
      textEl.textContent = this.strings[this.strings.length - 1] ?? '';
      this.el.nativeElement.appendChild(textEl);
      return;
    }

    this.textEl = document.createElement('span');
    this.textEl.setAttribute('data-testid', 'typing-text');

    this.cursorEl = document.createElement('span');
    this.cursorEl.setAttribute('data-testid', 'typing-cursor');
    this.cursorEl.setAttribute('aria-hidden', 'true');
    this.cursorEl.textContent = '|';

    this.el.nativeElement.appendChild(this.textEl);
    this.el.nativeElement.appendChild(this.cursorEl);

    this.startTyping();
  }

  private get currentString(): string {
    return this.strings[this.stringIndex] ?? '';
  }

  private startTyping(): void {
    this.interval = setInterval(() => this.typeNextChar(), TYPING_INTERVAL_MS);
  }

  private startPausing(): void {
    this.blinkCount = 0;
    this.interval = setInterval(() => this.blinkCursor(), BLINK_INTERVAL_MS);
  }

  private startDeleting(): void {
    this.interval = setInterval(
      () => this.deleteNextChar(),
      TYPING_INTERVAL_MS,
    );
  }

  private startBlinkingForever(): void {
    this.interval = setInterval(() => {
      this.cursorEl.hidden = !this.cursorEl.hidden;
    }, BLINK_INTERVAL_MS);
  }

  private typeNextChar(): void {
    this.charIndex++;
    this.textEl.textContent = this.currentString.slice(0, this.charIndex);

    if (this.charIndex >= this.currentString.length) {
      clearInterval(this.interval!);
      if (this.stringIndex === this.strings.length - 1) {
        this.startBlinkingForever();
      } else {
        this.startPausing();
      }
    }
  }

  private blinkCursor(): void {
    this.cursorEl.hidden = !this.cursorEl.hidden;
    this.blinkCount++;
    if (this.blinkCount >= PAUSE_BLINK_COUNT * 2) {
      clearInterval(this.interval!);
      this.startDeleting();
    }
  }

  private deleteNextChar(): void {
    this.charIndex--;
    this.textEl.textContent =
      this.charIndex > 0 ? this.currentString.slice(0, this.charIndex) : '';

    if (this.charIndex === 0) {
      clearInterval(this.interval!);
      this.stringIndex++;
      this.startTyping();
    }
  }

  ngOnDestroy(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
