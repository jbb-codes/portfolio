import { Injectable, NgZone, OnDestroy } from '@angular/core';

@Injectable()
export class AnimationLoopService implements OnDestroy {
  private rafId: number | null = null;

  constructor(private readonly zone: NgZone) {}

  start(draw: () => void): void {
    const prefersMotion = window.matchMedia(
      '(prefers-reduced-motion: no-preference)',
    ).matches;
    if (!prefersMotion) return;

    this.zone.runOutsideAngular(() => {
      const loop = () => {
        draw();
        this.rafId = requestAnimationFrame(loop);
      };

      this.rafId = requestAnimationFrame(loop);
    });
  }

  stop(): void {
    if (this.rafId === null) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
