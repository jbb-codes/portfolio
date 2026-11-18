import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ContactLink {
  label: string;
  href: string;
  testId: string;
  icon: 'mail' | 'github' | 'resume';
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
      label: 'Email me',
      href: 'mailto:bessjarren@yahoo.com',
      testId: 'contact-email',
      icon: 'mail',
      opensNewTab: false,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/jbb-codes',
      testId: 'contact-github',
      icon: 'github',
      opensNewTab: true,
    },
    {
      label: 'Resume',
      href: '/docs/Jarren_Bess_Resume.pdf',
      testId: 'contact-resume',
      icon: 'resume',
      opensNewTab: true,
    },
  ];
}
