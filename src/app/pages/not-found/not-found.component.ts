import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Used Claude to help implement the 404 not-found page.
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
