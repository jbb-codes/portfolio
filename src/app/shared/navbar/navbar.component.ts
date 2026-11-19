import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../shared/theme/theme.service';
import { PageScroller } from './page-scroller';

// Links are jump links to sections of the single page. Scrolling to the
// fragment is handled by the router's anchorScrolling option.
@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideSun, LucideMoon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly isDarkMode = toSignal(this.themeService.isDarkMode$, {
    requireSync: true,
  });
  readonly isAnimating = toSignal(this.themeService.isAnimating$, {
    requireSync: true,
  });

  constructor(
    readonly themeService: ThemeService,
    private readonly pageScroller: PageScroller,
  ) {}

  scrollToTop(event: Event): void {
    event.preventDefault();
    this.pageScroller.scrollToTop();
  }
}
