import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.component.html',
  styleUrl: './custom-cursor.component.css',
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  @ViewChild('cursorDot') private readonly cursorDot!: ElementRef<HTMLElement>;

  private readonly doc = inject(DOCUMENT);
  private readonly mouseMoveHandler = (event: MouseEvent) => this.updatePosition(event);

  ngOnInit(): void {
    this.doc.addEventListener('mousemove', this.mouseMoveHandler);
  }

  ngOnDestroy(): void {
    this.doc.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  private updatePosition(event: MouseEvent): void {
    const halfSize = 4;
    this.cursorDot.nativeElement.style.transform =
      `translate(${event.clientX - halfSize}px, ${event.clientY - halfSize}px)`;
  }
}
