import { DOCUMENT } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.component.html',
  styleUrl: './custom-cursor.component.css',
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly mouseMoveHandler = (event: MouseEvent) => this.updatePosition(event);

  ngOnInit(): void {
    this.doc.addEventListener('mousemove', this.mouseMoveHandler);
  }

  ngOnDestroy(): void {
    this.doc.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  private updatePosition(event: MouseEvent): void {
    this.doc.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    this.doc.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  }
}
