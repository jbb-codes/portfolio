import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUCKET_LIST, BucketListItem } from '../../data/portfolio-content';
import { TypingAnimationDirective } from './typing-animation.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TypingAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly roleStrings = ['Agentic', 'Full Stack', 'Modern Software'];
  readonly bucketList: BucketListItem[] = BUCKET_LIST;
}
