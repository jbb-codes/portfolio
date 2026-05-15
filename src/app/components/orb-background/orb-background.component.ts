import { Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';

export const ORB_RANGE_MIN = -10;
export const ORB_RANGE_MAX = 70;
const ORB_DRIFT_SPEED = 0.012; // % of viewport per frame at 60fps

export interface OrbState {
  left: number;
  top: number;
  driftX: number;
  driftY: number;
}

function makeOrbState(left: number, top: number): OrbState {
  const angle = Math.random() * Math.PI * 2;
  return {
    left,
    top,
    driftX: Math.cos(angle) * ORB_DRIFT_SPEED,
    driftY: Math.sin(angle) * ORB_DRIFT_SPEED,
  };
}

export function stepOrb(orb: Readonly<OrbState>): OrbState {
  let { left, top, driftX, driftY } = orb;
  left += driftX;
  top += driftY;
  if (left < ORB_RANGE_MIN) {
    driftX = -driftX;
    left = ORB_RANGE_MIN;
  } else if (left > ORB_RANGE_MAX) {
    driftX = -driftX;
    left = ORB_RANGE_MAX;
  }
  if (top < ORB_RANGE_MIN) {
    driftY = -driftY;
    top = ORB_RANGE_MIN;
  } else if (top > ORB_RANGE_MAX) {
    driftY = -driftY;
    top = ORB_RANGE_MAX;
  }
  return { left, top, driftX, driftY };
}

@Component({
  selector: 'app-orb-background',
  standalone: true,
  templateUrl: './orb-background.component.html',
  styleUrl: './orb-background.component.css',
})
export class OrbBackgroundComponent implements OnInit, OnDestroy {
  private orb1State: OrbState = makeOrbState(15, 15);
  private orb2State: OrbState = makeOrbState(65, 55);
  private rafId: number | null = null;

  constructor(
    private readonly el: ElementRef,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    this.zone.runOutsideAngular(() => this.startAnimation());
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private startAnimation(): void {
    const orb1El = this.el.nativeElement.querySelector(
      '.orb-background__orb--1',
    ) as HTMLElement;
    const orb2El = this.el.nativeElement.querySelector(
      '.orb-background__orb--2',
    ) as HTMLElement;

    const setTransform = (el: HTMLElement, left: number, top: number) => {
      el.style.transform = `translate(${left}vw, ${top}vh)`;
    };

    setTransform(orb1El, this.orb1State.left, this.orb1State.top);
    setTransform(orb2El, this.orb2State.left, this.orb2State.top);

    const loop = () => {
      this.orb1State = stepOrb(this.orb1State);
      this.orb2State = stepOrb(this.orb2State);

      setTransform(orb1El, this.orb1State.left, this.orb1State.top);
      setTransform(orb2El, this.orb2State.left, this.orb2State.top);

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }
}
