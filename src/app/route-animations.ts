import {
  AnimationTriggerMetadata,
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeFadeAnimation: AnimationTriggerMetadata = trigger(
  'routeFadeAnimation',
  [
    transition('* <=> *', [
      query(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))], {
        optional: true,
      }),
      query(':leave', [style({ opacity: 1 }), animate('150ms ease-out', style({ opacity: 0 }))], {
        optional: true,
      }),
    ]),
  ],
);
