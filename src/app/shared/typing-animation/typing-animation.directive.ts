import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

const TYPING_INTERVAL_MS = 50;
const BLINK_INTERVAL_MS = 500;
const PAUSE_BLINK_COUNT = 3;

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true,
})
export class TypingAnimationDirective implements OnInit, OnDestroy {
  @Input() strings: string[] = [];

  private frames: string[] = [];
  private frameIndex = 0;
  private blinkCount = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private textEl!: HTMLElement;
  private cursorEl!: HTMLElement;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.frames = this.strings.flatMap(str =>
      Array.from({ length: str.length }, (_, i) => str.slice(0, i + 1))
    );

    if (this.frames.length === 0) return;

    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
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

  private startTyping(): void {
    this.interval = setInterval(() => this.typeNextChar(), TYPING_INTERVAL_MS);
  }

  private startPausing(): void {
    this.blinkCount = 0;
    this.interval = setInterval(() => this.blinkCursor(), BLINK_INTERVAL_MS);
  }

  private startDeleting(): void {
    this.interval = setInterval(() => this.deleteNextChar(), TYPING_INTERVAL_MS);
  }

  private typeNextChar(): void {
    this.textEl.textContent = this.frames[this.frameIndex++];
    if (this.frameIndex >= this.frames.length) {
      clearInterval(this.interval!);
      this.startPausing();
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
    this.frameIndex--;
    this.textEl.textContent = this.frameIndex > 0 ? this.frames[this.frameIndex - 1] : '';
    if (this.frameIndex === 0) {
      clearInterval(this.interval!);
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
