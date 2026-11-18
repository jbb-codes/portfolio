import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../shared/theme/theme.service';

// Links are jump links to sections of the single page. Scrolling to the
// fragment is handled by the router's anchorScrolling option.
@Component({
  selector: 'app-navbar',
  standalone: true,
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

  constructor(readonly themeService: ThemeService) {}
}
