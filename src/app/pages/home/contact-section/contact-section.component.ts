import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ContactLink {
  label: string;
  href: string;
  testId: string;
  opensNewTab: boolean;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.css',
})
export class ContactSectionComponent {
  readonly links: readonly ContactLink[] = [
    {
      label: 'Email',
      href: 'mailto:bessjarren@yahoo.com',
      testId: 'contact-email',
      opensNewTab: false,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/jbb-codes',
      testId: 'contact-github',
      opensNewTab: true,
    },
    {
      label: 'Resume',
      href: '/docs/Jarren_Bess_Resume.pdf',
      testId: 'contact-resume',
      opensNewTab: true,
    },
  ];
}
