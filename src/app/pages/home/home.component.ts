import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface BucketListItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly bucketList: BucketListItem[] = [
    { id: '1', title: 'Visit Japan', description: 'Experience Japanese culture, cuisine, and landscapes', completed: false },
    { id: '2', title: 'Learn to surf', description: 'Catch waves on the California coast', completed: false },
    { id: '3', title: 'Run a marathon', description: 'Complete a full 26.2 mile race', completed: true },
    { id: '4', title: 'Write a book', description: 'Share knowledge and stories through writing', completed: false },
    { id: '5', title: 'See the Northern Lights', description: 'Witness the aurora borealis in Iceland', completed: false },
    { id: '6', title: 'Learn Thai cooking', description: 'Master the art of authentic Thai cuisine', completed: false },
    { id: '7', title: 'Hike the Appalachian Trail', description: 'Complete a section of the famous trail', completed: false },
    { id: '8', title: 'Build a startup', description: 'Launch a product that solves a real problem', completed: false },
  ];
}
