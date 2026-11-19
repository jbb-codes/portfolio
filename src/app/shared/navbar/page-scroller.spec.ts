import { TestBed } from '@angular/core/testing';
import { PageScroller } from './page-scroller';

describe('PageScroller', () => {
  let scrollTo: jasmine.Spy;

  function scrollWithReducedMotion(prefersReducedMotion: boolean): void {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: prefersReducedMotion,
    } as MediaQueryList);
    TestBed.inject(PageScroller).scrollToTop();
  }

  beforeEach(() => {
    scrollTo = spyOn(window, 'scrollTo');
  });

  it('scrolls smoothly to the top by default', () => {
    scrollWithReducedMotion(false);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls instantly when the user prefers reduced motion', () => {
    scrollWithReducedMotion(true);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });
});
