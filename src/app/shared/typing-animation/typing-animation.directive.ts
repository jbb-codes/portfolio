import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

const TYPING_INTERVAL_MS = 50;

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true,
})
export class TypingAnimationDirective implements OnInit, OnDestroy {
  @Input() strings: string[] = [];

  private frames: string[] = [];
  private frameIndex = 0;
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.frames = this.strings.flatMap(str =>
      Array.from({ length: str.length }, (_, i) => str.slice(0, i + 1))
    );

    if (this.frames.length === 0) return;

    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      this.el.nativeElement.textContent = this.strings[this.strings.length - 1] ?? '';
      return;
    }

    this.interval = setInterval(() => {
      this.el.nativeElement.textContent = this.frames[this.frameIndex++];
      if (this.frameIndex >= this.frames.length) {
        clearInterval(this.interval!);
        this.interval = null;
      }
    }, TYPING_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
