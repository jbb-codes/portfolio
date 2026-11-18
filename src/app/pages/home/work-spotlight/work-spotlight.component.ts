import { Component, computed, signal } from '@angular/core';
import { LucideArrowLeft, LucideArrowRight, LucideArrowUpRight } from '@lucide/angular';
import { PROJECTS } from '../../../data/portfolio-content';

@Component({
  selector: 'app-work-spotlight',
  standalone: true,
  imports: [LucideArrowLeft, LucideArrowRight, LucideArrowUpRight],
  templateUrl: './work-spotlight.component.html',
  styleUrl: './work-spotlight.component.css',
})
export class WorkSpotlightComponent {
  readonly projects = PROJECTS;
  readonly selectedIndex = signal(0);
  readonly selectedProject = computed(() => this.projects[this.selectedIndex()]);
  readonly counterLabel = computed(
    () =>
      `${this.pad(this.selectedIndex() + 1)} / ${this.pad(this.projects.length)}`,
  );

  select(index: number): void {
    this.selectedIndex.set(index);
  }

  next(): void {
    this.selectedIndex.update((index) => (index + 1) % this.projects.length);
  }

  previous(): void {
    const count = this.projects.length;
    this.selectedIndex.update((index) => (index - 1 + count) % count);
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
