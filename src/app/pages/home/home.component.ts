// Collaborated with Claude on: typing animation logic, ngOnDestroy cleanup pattern, fakeAsync/tick() test approach
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUCKET_LIST, BucketListItem } from '../../data/portfolio-content';

const FULL_ROLE = 'Full Stack Developer';
const TYPING_INTERVAL_MS = 50;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit, OnDestroy {
  displayedRole = '';
  private typingInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    let index = 0;
    this.typingInterval = setInterval(() => {
      index++;
      this.displayedRole = FULL_ROLE.slice(0, index);
      if (index === FULL_ROLE.length) {
        clearInterval(this.typingInterval!);
        this.typingInterval = null;
      }
    }, TYPING_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }
  readonly bucketList: BucketListItem[] = BUCKET_LIST;
}
