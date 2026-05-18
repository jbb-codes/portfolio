import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUCKET_LIST, BucketListItem } from '../../data/portfolio-content';
import { TypingAnimationDirective } from '../../shared/typing-animation/typing-animation.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TypingAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly roleStrings = ['Full Stack Developer'];
  readonly bucketList: BucketListItem[] = BUCKET_LIST;
}
