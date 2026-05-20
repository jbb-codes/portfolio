import { Component } from '@angular/core';
// === Begin: written with Claude guidance ===
// Claude walked through how to implement this component as part of a hands-on
// TDD learning exercise — I typed and applied each step as part of that process.
import { PROJECTS, Project } from '../../data/portfolio-content';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  readonly projects: Project[] = PROJECTS;
}
// === End: written with Claude guidance ===
