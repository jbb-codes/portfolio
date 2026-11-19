import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LucideArrowLeft, LucideArrowRight, LucideArrowUpRight } from '@lucide/angular';
import { PROJECTS } from '../../../data/portfolio-content';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';

const ROTATION_INTERVAL_MS = 3000;

@Component({
  selector: 'app-work-spotlight',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideArrowLeft,
    LucideArrowRight,
    LucideArrowUpRight,
    SectionHeaderComponent,
  ],
  templateUrl: './work-spotlight.component.html',
  styleUrl: './work-spotlight.component.css',
})
export class WorkSpotlightComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly prefersReducedMotion =
    this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly projects = PROJECTS;
  readonly selectedIndex = signal(0);
  readonly cycle = signal(0);
  readonly isHovered = signal(false);
  readonly hasKeyboardFocus = signal(false);
  readonly isRotating = computed(
    () =>
      this.isBrowser &&
      !this.prefersReducedMotion &&
      !this.isHovered() &&
      !this.hasKeyboardFocus(),
  );
  readonly selectedProject = computed(() => this.projects[this.selectedIndex()]);
  readonly counterLabel = computed(
    () =>
      `${this.pad(this.selectedIndex() + 1)} / ${this.pad(this.projects.length)}`,
  );

  constructor() {
    effect((onCleanup) => {
      this.selectedIndex();
      this.cycle();
      if (!this.isRotating()) {
        return;
      }
      const timer = setTimeout(() => this.advance(), ROTATION_INTERVAL_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);
    this.restartCycle();
  }

  next(): void {
    this.advance();
    this.restartCycle();
  }

  previous(): void {
    const count = this.projects.length;
    this.selectedIndex.update((index) => (index - 1 + count) % count);
    this.restartCycle();
  }

  // Mouse clicks also focus buttons; only :focus-visible (keyboard) focus should pause,
  // otherwise a click would freeze rotation until the user clicks elsewhere.
  onFocusIn(event: FocusEvent): void {
    this.hasKeyboardFocus.set((event.target as Element).matches(':focus-visible'));
  }

  onFocusOut(): void {
    this.hasKeyboardFocus.set(false);
  }

  private advance(): void {
    this.selectedIndex.update((index) => (index + 1) % this.projects.length);
  }

  private restartCycle(): void {
    this.cycle.update((value) => value + 1);
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
