import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface Dot {
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
}

const DOT_COUNT = 60;
const DOT_RADIUS = 1.5;
const DOT_SPEED = 0.3;

@Component({
  selector: 'app-particle-background',
  standalone: true,
  templateUrl: './particle-background.component.html',
  styleUrl: './particle-background.component.css',
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView!;
  private animationId = 0;
  private dots: Dot[] = [];
  private pixelScale = 1;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.resizeCanvas(this.win.innerWidth, this.win.innerHeight);

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) this.resizeCanvas(entry.contentRect.width, entry.contentRect.height);
    });
    this.resizeObserver.observe(this.canvasRef.nativeElement);

    if (this.win.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      this.scheduleFrame();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.win.cancelAnimationFrame(this.animationId);
  }

  private resizeCanvas(width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;
    this.pixelScale = this.win.devicePixelRatio || 1;
    const physicalWidth = Math.round(width * this.pixelScale);
    const physicalHeight = Math.round(height * this.pixelScale);

    if (canvas.width === physicalWidth && canvas.height === physicalHeight) return;

    this.logicalWidth = width;
    this.logicalHeight = height;
    canvas.width = physicalWidth;
    canvas.height = physicalHeight;

    this.initDots(width, height);
  }

  private initDots(width: number, height: number): void {
    this.dots = Array.from({ length: DOT_COUNT }, () => ({
      positionX: Math.random() * width,
      positionY: Math.random() * height,
      velocityX: (Math.random() - 0.5) * DOT_SPEED * 2,
      velocityY: (Math.random() - 0.5) * DOT_SPEED * 2,
    }));
  }

  private scheduleFrame(): void {
    this.animationId = this.win.requestAnimationFrame(() => this.draw());
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pixelScale, logicalWidth, logicalHeight } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(this.doc.documentElement)
      .getPropertyValue('--particle-color')
      .trim();

    for (const dot of this.dots) {
      dot.positionX += dot.velocityX;
      dot.positionY += dot.velocityY;

      if (dot.positionX < 0) dot.positionX += logicalWidth;
      if (dot.positionX > logicalWidth) dot.positionX -= logicalWidth;
      if (dot.positionY < 0) dot.positionY += logicalHeight;
      if (dot.positionY > logicalHeight) dot.positionY -= logicalHeight;

      ctx.beginPath();
      ctx.arc(dot.positionX * pixelScale, dot.positionY * pixelScale, DOT_RADIUS * pixelScale, 0, Math.PI * 2);
      ctx.fill();
    }

    this.scheduleFrame();
  }
}
