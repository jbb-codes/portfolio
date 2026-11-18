import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BUCKET_LIST } from '../../../data/portfolio-content';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css',
})
export class BucketListComponent {
  readonly items = BUCKET_LIST;
  readonly totalCount = BUCKET_LIST.length;
  readonly completedCount = BUCKET_LIST.filter((item) => item.completed).length;
  readonly completedPercent =
    this.totalCount === 0 ? 0 : (this.completedCount / this.totalCount) * 100;
}
