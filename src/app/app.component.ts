import { Component, ElementRef, Injector, OnDestroy, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { routeFadeAnimation } from './route-animations';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { OrbBackgroundComponent } from './components/orb-background/orb-background.component';
import { ParticleBackgroundComponent } from './components/particle-background/particle-background.component';
import { ThemeService } from './shared/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideSun, LucideMoon, CustomCursorComponent, OrbBackgroundComponent, ParticleBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeAnimation],
})
export class AppComponent implements OnDestroy {
  readonly isDarkMode = toSignal(this.themeService.isDarkMode$, { requireSync: true });
  readonly isAnimating = toSignal(this.themeService.isAnimating$, { requireSync: true });

  private routerSub!: Subscription;
  constructor(
    private readonly router: Router,
    private readonly el: ElementRef,
    private readonly injector: Injector,
    readonly themeService: ThemeService,
  ) {
    afterNextRender(() => this.updateUnderline());
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0 });
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
}
