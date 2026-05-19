import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";

const DOT_SIZE = 8;
const RING_SIZE = 32;
const RING_LERP = 0.35;
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';

@Component({
  selector: "app-custom-cursor",
  standalone: true,
  templateUrl: "./custom-cursor.component.html",
  styleUrl: "./custom-cursor.component.css",
})
export class CustomCursorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("cursorDot")
  private readonly cursorDot!: ElementRef<HTMLElement>;

  @ViewChild("cursorRing")
  private readonly cursorRing!: ElementRef<HTMLElement>;

  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly mouseMoveHandler = (event: MouseEvent) =>
    this.onMouseMove(event);
  private readonly clickHandler = (event: MouseEvent) =>
    this.onProximityClick(event);

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId = 0;
  private isFirstMove = true;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener("mousemove", this.mouseMoveHandler, { passive: true });
      this.doc.addEventListener("click", this.clickHandler, { capture: true });
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.startRingLoop());
  }

  ngOnDestroy(): void {
    this.doc.removeEventListener("mousemove", this.mouseMoveHandler);
    this.doc.removeEventListener("click", this.clickHandler, { capture: true });
    cancelAnimationFrame(this.rafId);
  }

  private onProximityClick(event: MouseEvent): void {
    if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) return;

    const nearest = this.findNearestInteractive(event.clientX, event.clientY);
    if (nearest) {
      nearest.click();
    }
  }

  private findNearestInteractive(x: number, y: number): HTMLElement | null {
    const radius = RING_SIZE / 2;
    const angleSteps = 8;

    for (let r = 4; r <= radius; r += 4) {
      for (let i = 0; i < angleSteps; i++) {
        const angle = (i / angleSteps) * Math.PI * 2;
        const el = this.doc.elementFromPoint(
          x + Math.cos(angle) * r,
          y + Math.sin(angle) * r,
        );
        const interactive = el?.closest(INTERACTIVE_SELECTOR);
        if (interactive) return interactive as HTMLElement;
      }
    }
    return null;
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    if (this.isFirstMove) {
      this.ringX = this.mouseX;
      this.ringY = this.mouseY;
      this.isFirstMove = false;
    }

    const halfDot = DOT_SIZE / 2;
    this.cursorDot.nativeElement.style.transform = `translate(${this.mouseX - halfDot}px, ${this.mouseY - halfDot}px)`;
  }

  private startRingLoop(): void {
    const tick = () => {
      this.ringX += (this.mouseX - this.ringX) * RING_LERP;
      this.ringY += (this.mouseY - this.ringY) * RING_LERP;
      const halfRing = RING_SIZE / 2;
      this.cursorRing.nativeElement.style.transform = `translate(${this.ringX - halfRing}px, ${this.ringY - halfRing}px)`;
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
}
