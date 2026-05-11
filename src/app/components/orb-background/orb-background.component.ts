import { Component, OnDestroy, OnInit } from '@angular/core';

export const MOVE_INTERVAL_MIN = 6_000;
export const MOVE_INTERVAL_MAX = 8_000;
export const ORB_RANGE_MIN = -20;
export const ORB_RANGE_MAX = 100;
export const EXCLUSION_MIN = 25;
export const EXCLUSION_MAX = 75;

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

@Component({
  selector: 'app-orb-background',
  standalone: true,
  templateUrl: './orb-background.component.html',
  styleUrl: './orb-background.component.css',
})
export class OrbBackgroundComponent implements OnInit, OnDestroy {
  orb1: OrbPosition = { x: -15, y: -20 };
  orb2: OrbPosition = { x: 85, y: 75 };

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
      this.orb1 = getRandomPosition();
      this.orb2 = getRandomPosition();
      this.scheduleMovement();
    }, delay);
  }
}
