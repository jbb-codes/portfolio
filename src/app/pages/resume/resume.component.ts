import { Component } from '@angular/core';
import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  SKILLS,
} from '../../data/portfolio-content';

// Used Claude to help implement the resume page as a pure display component
// that pulls all content from the shared data module.
@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent {
  readonly experience = EXPERIENCE;
  readonly education = EDUCATION;
  readonly skills = SKILLS;
  readonly certifications = CERTIFICATIONS;
}
