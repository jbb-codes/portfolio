import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

export const ORB_RANGE_MIN = -10;
export const ORB_RANGE_MAX = 70;
export const ORB_RADIUS_PX = 200;
const ORB_DRIFT_SPEED = 0.3; // % of viewport per frame, normalized to 60fps
const FRAME_BASELINE_MS = 1000 / 60; // 16.67ms — reference frame duration for speed normalization

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

function bounceAxis(
  pos: number,
  drift: number,
  min: number,
  max: number,
): { pos: number; drift: number } {
  if (pos < min) return { pos: min, drift: Math.abs(drift) };
  if (pos > max) return { pos: max, drift: -Math.abs(drift) };
  return { pos, drift };
}

export function stepOrb(
  orb: Readonly<OrbState>,
  deltaScale: number,
  viewportWidth: number,
  viewportHeight: number,
): OrbState {
  const rangeMinX = (-ORB_RADIUS_PX / viewportWidth) * 100;
  const rangeMaxX = ((viewportWidth - ORB_RADIUS_PX) / viewportWidth) * 100;
  const rangeMinY = (-ORB_RADIUS_PX / viewportHeight) * 100;
  const rangeMaxY = ((viewportHeight - ORB_RADIUS_PX) / viewportHeight) * 100;

  const x = bounceAxis(orb.left + orb.driftX * deltaScale, orb.driftX, rangeMinX, rangeMaxX);
  const y = bounceAxis(orb.top + orb.driftY * deltaScale, orb.driftY, rangeMinY, rangeMaxY);

  return { left: x.pos, top: y.pos, driftX: x.drift, driftY: y.drift };
}

export function resolveOrbCollisions(
  orb1: Readonly<OrbState>,
  orb2: Readonly<OrbState>,
  viewportWidth: number,
  viewportHeight: number,
): [OrbState, OrbState] {
  const orb1X = (orb1.left * viewportWidth) / 100;
  const orb1Y = (orb1.top * viewportHeight) / 100;
  const orb2X = (orb2.left * viewportWidth) / 100;
  const orb2Y = (orb2.top * viewportHeight) / 100;
  const deltaX = orb2X - orb1X;
  const deltaY = orb2Y - orb1Y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Dot product of the separation vector and relative velocity: negative means
  // the orbs are closing the gap. Skip the bounce if they are already separating
  // to prevent repeated reversals while centers are still overlapping.
  const isMovingTowardEachOther =
    deltaX * (orb2.driftX - orb1.driftX) +
      deltaY * (orb2.driftY - orb1.driftY) <
    0;

  if (distance >= ORB_RADIUS_PX * 2 || !isMovingTowardEachOther) {
    return [orb1, orb2];
  }

  return [
    { ...orb1, driftX: -orb1.driftX, driftY: -orb1.driftY },
    { ...orb2, driftX: -orb2.driftX, driftY: -orb2.driftY },
  ];
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
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
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

    let lastTime: number | null = null;

    const loop = (timestamp: number) => {
      const deltaMs = lastTime === null ? FRAME_BASELINE_MS : timestamp - lastTime;
      lastTime = timestamp;
      // Clamp to 3× baseline so a suspended tab doesn't cause a huge position jump.
      const deltaScale = Math.min(deltaMs, FRAME_BASELINE_MS * 3) / FRAME_BASELINE_MS;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      this.orb1State = stepOrb(this.orb1State, deltaScale, vw, vh);
      this.orb2State = stepOrb(this.orb2State, deltaScale, vw, vh);

      [this.orb1State, this.orb2State] = resolveOrbCollisions(
        this.orb1State,
        this.orb2State,
        window.innerWidth,
        window.innerHeight,
      );

      setTransform(orb1El, this.orb1State.left, this.orb1State.top);
      setTransform(orb2El, this.orb2State.left, this.orb2State.top);

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }
}
