import { Component } from '@angular/core';
import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  LEARNING_NEXT,
  SKILLS,
} from '../../data/portfolio-content';

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
  readonly learningNext = LEARNING_NEXT;
}
