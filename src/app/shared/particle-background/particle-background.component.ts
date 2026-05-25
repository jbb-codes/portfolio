import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationLoopService } from '../../shared/animation-loop/animation-loop.service';

interface Dot {
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Shard {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  alpha: number;
  size: number;
}

const DOT_COUNT = 60;
const DOT_RADIUS = 1.5;
const DOT_SPEED = 0.3;
const RESIZE_DEBOUNCE_MS = 100;
const PULSE_SPEED = 6;
const PULSE_MAX_RADIUS = 48;
const PULSE_LINE_WIDTH = 1.5;
const CURSOR_RING_RADIUS = 16;
const SHARD_COUNT = 5;
const SHARD_SPEED_MIN = 0.8;
const SHARD_SPEED_MAX = 2.5;
const SHARD_FADE_RATE = 0.022;
const SHARD_SIZE_MIN = 0.8;
const SHARD_SIZE_MAX = 2;
const DOT_RESPAWN_DELAY_MS = 2500;
const RING_SAMPLE_STEPS = 8;
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, [role="button"]';
const CONTENT_SELECTOR = `${INTERACTIVE_SELECTOR}, [data-cursor-hover]`;

// Used Claude to help implement the canvas particle system, including the
// pulse ring and shard scatter effects triggered on background clicks.
// Users who prefer reduced motion get a static snapshot instead; a
// MutationObserver redraws it whenever the theme attribute changes.
@Component({
  selector: 'app-particle-background',
  standalone: true,
  templateUrl: './particle-background.component.html',
  styleUrl: './particle-background.component.css',
  providers: [AnimationLoopService],
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView!;
  private readonly animationLoop = inject(AnimationLoopService);
  private dots: Dot[] = [];
  private pulses: Pulse[] = [];
  private shards: Shard[] = [];
  private respawnTimers: ReturnType<typeof setTimeout>[] = [];
  private pixelScale = 1;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private resizeObserver!: ResizeObserver;
  private themeObserver!: MutationObserver;
  private resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly clickHandler = (event: MouseEvent) =>
    this.onBackgroundClick(event);

  private readonly prefersReducedMotion = !this.win.matchMedia(
    '(prefers-reduced-motion: no-preference)',
  ).matches;

  ngOnInit(): void {
    this.resizeCanvas(this.win.innerWidth, this.win.innerHeight);

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (this.resizeDebounceTimer !== null)
        clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = setTimeout(() => {
        this.resizeCanvas(entry.contentRect.width, entry.contentRect.height);
        if (this.prefersReducedMotion) this.drawStatic();
        this.resizeDebounceTimer = null;
      }, RESIZE_DEBOUNCE_MS);
    });
    this.resizeObserver.observe(this.canvasRef.nativeElement);

    if (this.prefersReducedMotion) {
      this.drawStatic();
      this.themeObserver = new MutationObserver(() => this.drawStatic());
      this.themeObserver.observe(this.doc.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    } else {
      this.animationLoop.start(() => this.draw());
      this.doc.addEventListener('click', this.clickHandler, { capture: true });
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.themeObserver?.disconnect();
    if (this.resizeDebounceTimer !== null)
      clearTimeout(this.resizeDebounceTimer);
    this.respawnTimers.forEach((id) => clearTimeout(id));
    this.doc.removeEventListener('click', this.clickHandler, { capture: true });
    this.animationLoop.stop();
  }

  private onBackgroundClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (target.closest(CONTENT_SELECTOR)) return;
    if (this.isRingNearContent(event.clientX, event.clientY)) return;
    this.triggerPulse(event.clientX, event.clientY);
  }

  private isRingNearContent(x: number, y: number): boolean {
    for (let i = 0; i < RING_SAMPLE_STEPS; i++) {
      const angle = (i / RING_SAMPLE_STEPS) * Math.PI * 2;
      const el = this.doc.elementFromPoint(
        x + Math.cos(angle) * CURSOR_RING_RADIUS,
        y + Math.sin(angle) * CURSOR_RING_RADIUS,
      );
      if (el?.closest(CONTENT_SELECTOR)) return true;
    }
    return false;
  }

  private triggerPulse(x: number, y: number): void {
    const insideRing = this.dots.filter(
      (dot) =>
        Math.hypot(dot.positionX - x, dot.positionY - y) <= CURSOR_RING_RADIUS,
    );
    this.dots = this.dots.filter(
      (dot) =>
        Math.hypot(dot.positionX - x, dot.positionY - y) > CURSOR_RING_RADIUS,
    );

    for (const dot of insideRing) {
      this.spawnShards(dot.positionX, dot.positionY);
      this.scheduleRespawn();
    }

    this.pulses = [
      ...this.pulses,
      { x, y, radius: CURSOR_RING_RADIUS, alpha: 1 },
    ];
  }

  private spawnShards(x: number, y: number): void {
    const newShards = Array.from({ length: SHARD_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed =
        SHARD_SPEED_MIN + Math.random() * (SHARD_SPEED_MAX - SHARD_SPEED_MIN);
      return {
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        alpha: 1,
        size:
          SHARD_SIZE_MIN + Math.random() * (SHARD_SIZE_MAX - SHARD_SIZE_MIN),
      };
    });
    this.shards = [...this.shards, ...newShards];
  }

  private scheduleRespawn(): void {
    const timerId = setTimeout(() => {
      this.dots = [
        ...this.dots,
        {
          positionX: Math.random() * this.logicalWidth,
          positionY: Math.random() * this.logicalHeight,
          velocityX: (Math.random() - 0.5) * DOT_SPEED * 2,
          velocityY: (Math.random() - 0.5) * DOT_SPEED * 2,
        },
      ];
      this.respawnTimers = this.respawnTimers.filter((id) => id !== timerId);
    }, DOT_RESPAWN_DELAY_MS);
    this.respawnTimers = [...this.respawnTimers, timerId];
  }

  private resizeCanvas(width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;
    this.pixelScale = this.win.devicePixelRatio || 1;
    const physicalWidth = Math.round(width * this.pixelScale);
    const physicalHeight = Math.round(height * this.pixelScale);

    if (canvas.width === physicalWidth && canvas.height === physicalHeight)
      return;

    this.logicalWidth = width;
    this.logicalHeight = height;
    canvas.width = physicalWidth;
    canvas.height = physicalHeight;

    this.initDots(width, height);
  }

  private initDots(width: number, height: number): void {
    if (this.dots.length > 0) return;
    this.dots = Array.from({ length: DOT_COUNT }, () => ({
      positionX: Math.random() * width,
      positionY: Math.random() * height,
      velocityX: (Math.random() - 0.5) * DOT_SPEED * 2,
      velocityY: (Math.random() - 0.5) * DOT_SPEED * 2,
    }));
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pixelScale, logicalWidth, logicalHeight } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particleColor = getComputedStyle(this.doc.documentElement)
      .getPropertyValue('--particle-color')
      .trim();

    ctx.fillStyle = particleColor;

    for (const dot of this.dots) {
      dot.positionX += dot.velocityX;
      dot.positionY += dot.velocityY;

      if (dot.positionX < 0) dot.positionX += logicalWidth;
      if (dot.positionX > logicalWidth) dot.positionX -= logicalWidth;
      if (dot.positionY < 0) dot.positionY += logicalHeight;
      if (dot.positionY > logicalHeight) dot.positionY -= logicalHeight;

      ctx.beginPath();
      ctx.arc(
        dot.positionX * pixelScale,
        dot.positionY * pixelScale,
        DOT_RADIUS * pixelScale,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    this.updateAndDrawPulses(ctx, pixelScale, particleColor);
    this.updateAndDrawShards(ctx, pixelScale, particleColor);
  }

  private updateAndDrawPulses(
    ctx: CanvasRenderingContext2D,
    pixelScale: number,
    color: string,
  ): void {
    if (this.pulses.length === 0) return;

    const destroyedIndices = new Set<number>();
    const updatedPulses: Pulse[] = [];

    for (const pulse of this.pulses) {
      const prevRadius = pulse.radius;
      const nextRadius = pulse.radius + PULSE_SPEED;
      const nextAlpha = Math.max(0, 1 - nextRadius / PULSE_MAX_RADIUS);

      for (let i = 0; i < this.dots.length; i++) {
        if (destroyedIndices.has(i)) continue;
        const dot = this.dots[i];
        const dist = Math.hypot(
          dot.positionX - pulse.x,
          dot.positionY - pulse.y,
        );
        if (dist >= prevRadius && dist < nextRadius) {
          destroyedIndices.add(i);
        }
      }

      ctx.save();
      ctx.globalAlpha = nextAlpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = PULSE_LINE_WIDTH * pixelScale;
      ctx.beginPath();
      ctx.arc(
        pulse.x * pixelScale,
        pulse.y * pixelScale,
        nextRadius * pixelScale,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.restore();

      if (nextAlpha > 0 && nextRadius < PULSE_MAX_RADIUS) {
        updatedPulses.push({ ...pulse, radius: nextRadius, alpha: nextAlpha });
      }
    }

    this.pulses = updatedPulses;

    if (destroyedIndices.size > 0) {
      const toDestroy = this.dots.filter((_, i) => destroyedIndices.has(i));
      this.dots = this.dots.filter((_, i) => !destroyedIndices.has(i));
      for (const dot of toDestroy) {
        this.spawnShards(dot.positionX, dot.positionY);
        this.scheduleRespawn();
      }
    }
  }

  private updateAndDrawShards(
    ctx: CanvasRenderingContext2D,
    pixelScale: number,
    color: string,
  ): void {
    if (this.shards.length === 0) return;

    const remainingShards: Shard[] = [];

    for (const shard of this.shards) {
      const nextAlpha = shard.alpha - SHARD_FADE_RATE;
      if (nextAlpha <= 0) continue;

      const nextX = shard.x + shard.velocityX;
      const nextY = shard.y + shard.velocityY;

      ctx.save();
      ctx.globalAlpha = nextAlpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        nextX * pixelScale,
        nextY * pixelScale,
        shard.size * pixelScale,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();

      remainingShards.push({ ...shard, x: nextX, y: nextY, alpha: nextAlpha });
    }

    this.shards = remainingShards;
  }

  private drawStatic(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pixelScale } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(this.doc.documentElement)
      .getPropertyValue('--particle-color')
      .trim();

    for (const dot of this.dots) {
      ctx.beginPath();
      ctx.arc(
        dot.positionX * pixelScale,
        dot.positionY * pixelScale,
        DOT_RADIUS * pixelScale,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}
