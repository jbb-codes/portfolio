import { Component, OnDestroy, OnInit } from '@angular/core';

export const MOVE_INTERVAL_MIN = 24_000;
export const MOVE_INTERVAL_MAX = 26_000;
export const ORB_RANGE_MIN = -10;
export const ORB_RANGE_MAX = 70;
export const EXCLUSION_MIN = 25;
export const EXCLUSION_MAX = 75;
export const MIN_ORB_SEPARATION = 40;

export interface OrbPosition {
  x: number;
  y: number;
}

export function getRandomPosition(): OrbPosition {
  let x: number;
  let y: number;
  do {
    x = ORB_RANGE_MIN + Math.random() * (ORB_RANGE_MAX - ORB_RANGE_MIN);
    y = ORB_RANGE_MIN + Math.random() * (ORB_RANGE_MAX - ORB_RANGE_MIN);
  } while (x >= EXCLUSION_MIN && x <= EXCLUSION_MAX && y >= EXCLUSION_MIN && y <= EXCLUSION_MAX);
  return { x, y };
}

export function getOrbPositions(): [OrbPosition, OrbPosition] {
  let pos1: OrbPosition;
  let pos2: OrbPosition;
  let separated = false;
  do {
    pos1 = getRandomPosition();
    pos2 = getRandomPosition();
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    separated = Math.sqrt(dx * dx + dy * dy) >= MIN_ORB_SEPARATION;
  } while (!separated);
  return [pos1, pos2];
}

@Component({
  selector: 'app-orb-background',
  standalone: true,
  templateUrl: './orb-background.component.html',
  styleUrl: './orb-background.component.css',
})
export class OrbBackgroundComponent implements OnInit, OnDestroy {
  orb1: OrbPosition = { x: -5, y: -8 };
  orb2: OrbPosition = { x: 60, y: 10 };

  private timerId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      this.scheduleMovement();
    }
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleMovement(): void {
    const delay = MOVE_INTERVAL_MIN + Math.random() * (MOVE_INTERVAL_MAX - MOVE_INTERVAL_MIN);
    this.timerId = setTimeout(() => {
      [this.orb1, this.orb2] = getOrbPositions();
      this.scheduleMovement();
    }, delay);
  }
}
