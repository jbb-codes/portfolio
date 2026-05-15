// Collaborated with Claude on: animation guard pattern, prefers-reduced-motion fix, lucide-angular icon integration
import { Component, ElementRef, Injector, OnDestroy, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { routeFadeAnimation } from './route-animations';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { OrbBackgroundComponent } from './components/orb-background/orb-background.component';
import { ParticleBackgroundComponent } from './components/particle-background/particle-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideSun, LucideMoon, CustomCursorComponent, OrbBackgroundComponent, ParticleBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeAnimation],
})
export class AppComponent implements OnDestroy {
  isDarkMode = true;
  isAnimating = false;

  private routerSub!: Subscription;
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly leaveAnimationDuration = 300;

  constructor(private readonly router: Router, private readonly el: ElementRef, private readonly injector: Injector) {
    afterNextRender(() => this.updateUnderline());
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const delay = this.prefersReducedMotion ? 0 : this.leaveAnimationDuration;
        setTimeout(() => window.scrollTo({ top: 0 }), delay);
        afterNextRender(() => this.updateUnderline(), { injector: this.injector });
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateUnderline(): void {
    const ul: HTMLElement | null = this.el.nativeElement.querySelector('.navbar__links');
    const active: HTMLElement | null = ul?.querySelector('.navbar__link--active') ?? null;
    if (!ul || !active) return;
    ul.style.setProperty('--underline-left', `${active.offsetLeft}px`);
    ul.style.setProperty('--underline-width', `${active.offsetWidth}px`);
  }

  toggleTheme(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setTimeout(() => this.clearAnimation(), 400);
  }

  clearAnimation(): void {
    this.isAnimating = false;
  }
}
