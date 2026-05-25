// Used Claude to help implement the page transition fade animation.
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
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('400ms ease-in-out', style({ opacity: 1 })),
        ],
        { optional: true },
      ),
    ]),
  ],
);
