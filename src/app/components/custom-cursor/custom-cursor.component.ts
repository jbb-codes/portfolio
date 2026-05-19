import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";

const DOT_SIZE = 8;
const RING_SIZE = 32;
const RING_LERP = 0.12;

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
  private readonly mouseMoveHandler = (event: MouseEvent) =>
    this.onMouseMove(event);

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId = 0;
  private isFirstMove = true;

  ngOnInit(): void {
    this.doc.addEventListener("mousemove", this.mouseMoveHandler);
  }

  ngAfterViewInit(): void {
    this.startRingLoop();
  }

  ngOnDestroy(): void {
    this.doc.removeEventListener("mousemove", this.mouseMoveHandler);
    cancelAnimationFrame(this.rafId);
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
