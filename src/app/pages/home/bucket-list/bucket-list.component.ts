import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../shared/section-header/section-header.component';
import { BUCKET_LIST } from '../../../data/portfolio-content';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css',
})
export class BucketListComponent {
  readonly items = BUCKET_LIST;
  readonly totalCount = BUCKET_LIST.length;
  readonly completedCount = BUCKET_LIST.filter((item) => item.completed).length;
}
