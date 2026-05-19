import { Component, ElementRef, Injector, OnDestroy, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../shared/theme/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideSun, LucideMoon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
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
