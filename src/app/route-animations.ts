import {
  AnimationTriggerMetadata,
  animate,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeFadeAnimation: AnimationTriggerMetadata = trigger(
  'routeFadeAnimation',
  [
    transition('* <=> *', [
      query(':enter', [style({ opacity: 0 })], { optional: true }),
      sequence([
        query(':leave', [
          style({ position: 'absolute', top: 0, left: 0, width: '100%' }),
          animate('300ms ease-in-out', style({ opacity: 0 })),
        ], { optional: true }),
        query(':enter', [animate('500ms ease-in-out', style({ opacity: 1 }))], { optional: true }),
      ]),
    ]),
  ],
);
