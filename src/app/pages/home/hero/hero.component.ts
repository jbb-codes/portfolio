import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrambleTextDirective } from '../scramble-text.directive';

type OrbitName = 'inner' | 'outer';

interface OrbitDot {
  readonly name: OrbitName;
  readonly label: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ScrambleTextDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  readonly rolePhrase = 'Modern Software Developer';
  readonly orbitRings = [1, 2];
  readonly orbitDots: readonly OrbitDot[] = [
    { name: 'outer', label: 'SECURE, CLEAN CODE' },
    { name: 'inner', label: 'AGENTIC AI · LLM TOOLING' },
  ];

  readonly expandedOrbit = signal<OrbitName | null>(null);

  // A tap or click also focuses the button. Without this guard the focus
  // handler would expand the pill and the click handler would toggle it
  // straight back closed.
  private pointerInteracting = false;
  private lastPointerType = '';

  @HostListener('document:click', ['$event'])
  collapseOnOutsideClick(event: Event): void {
    const target = event.target as Element | null;
    if (!target?.closest('[data-orbit-dot]')) this.expandedOrbit.set(null);
  }

  onPointerEnter(name: OrbitName, event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.expandedOrbit.set(name);
  }

  onPointerLeave(name: OrbitName, event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.collapse(name);
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerInteracting = true;
    this.lastPointerType = event.pointerType;
  }

  onFocus(name: OrbitName): void {
    if (!this.pointerInteracting) this.expandedOrbit.set(name);
  }

  onBlur(name: OrbitName): void {
    this.pointerInteracting = false;
    this.collapse(name);
  }

  onClick(name: OrbitName): void {
    const followsMouse =
      this.pointerInteracting && this.lastPointerType === 'mouse';
    this.pointerInteracting = false;

    // Hover already expanded the pill under a mouse; toggling would close it
    // beneath the cursor.
    if (followsMouse) {
      this.expandedOrbit.set(name);
      return;
    }
    this.expandedOrbit.update((current) => (current === name ? null : name));
  }

  onEscape(): void {
    this.expandedOrbit.set(null);
  }

  private collapse(name: OrbitName): void {
    this.expandedOrbit.update((current) => (current === name ? null : current));
  }
}
