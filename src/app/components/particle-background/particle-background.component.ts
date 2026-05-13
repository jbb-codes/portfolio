import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
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
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    this.initDots(width, height);
  }

  private initDots(width: number, height: number): void {
    this.dots = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * DOT_SPEED * 2,
      vy: (Math.random() - 0.5) * DOT_SPEED * 2,
    }));
  }

  private scheduleFrame(): void {
    this.animationId = this.win.requestAnimationFrame(() => this.draw());
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(this.doc.documentElement)
      .getPropertyValue('--particle-color')
      .trim();

    for (const dot of this.dots) {
      dot.x += dot.vx;
      dot.y += dot.vy;

      if (dot.x < 0) dot.x += canvas.width;
      if (dot.x > canvas.width) dot.x -= canvas.width;
      if (dot.y < 0) dot.y += canvas.height;
      if (dot.y > canvas.height) dot.y -= canvas.height;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    this.scheduleFrame();
  }
}
