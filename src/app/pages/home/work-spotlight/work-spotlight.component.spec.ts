import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PROJECTS } from '../../../data/portfolio-content';
import { WorkSpotlightComponent } from './work-spotlight.component';

describe('WorkSpotlightComponent', () => {
  let fixture: ComponentFixture<WorkSpotlightComponent>;
  let element: HTMLElement;

  const query = (selector: string): HTMLElement =>
    element.querySelector(selector) as HTMLElement;
  const queryAll = (selector: string): HTMLElement[] =>
    Array.from(element.querySelectorAll(selector));
  const click = (selector: string, index = 0): void => {
    queryAll(selector)[index].click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSpotlightComponent],
    }).compileComponents();
  });

  // Headless runs don't reliably match :focus-visible for programmatic focus.
  const focusWithKeyboard = (target: HTMLElement, matchesFocusVisible = true): void => {
    spyOn(target, 'matches').and.callFake(
      (selector: string) => selector === ':focus-visible' && matchesFocusVisible,
    );
    target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  };

  const render = (): void => {
    fixture = TestBed.createComponent(WorkSpotlightComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  };

  describe('selection', () => {
    beforeEach(render);

    it('shares the page gutters with the other sections', () => {
      expect(query('#work').classList).toContain('page-section');
    });

    it('renders the work section anchor with a heading', () => {
      expect(query('section#work')).toBeTruthy();
      expect(query('#work-heading')).toBeTruthy();
    });

    it('spotlights the first project by default', () => {
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
      expect(query('.spotlight__description').textContent).toContain(
        PROJECTS[0].description,
      );
    });

    it('serves each project screenshot as WebP', () => {
      PROJECTS.forEach((_, index) => {
        click('.work-tab', index);
        const screenshot = query('.spotlight__screenshot') as HTMLImageElement;
        expect(screenshot.getAttribute('src')).toMatch(/\.webp$/);
      });
    });

    it('lazy-loads the screenshot so it cannot compete with the hero image', () => {
      const screenshot = query('.spotlight__screenshot') as HTMLImageElement;
      expect(screenshot.getAttribute('loading')).toBe('lazy');
    });

    it('links the spotlight to the project repository', () => {
      expect(query('.spotlight__link').getAttribute('href')).toBe(
        PROJECTS[0].githubUrl,
      );
    });

    it('renders one tab per project', () => {
      expect(queryAll('.work-tab').length).toBe(PROJECTS.length);
    });

    it('marks only the active tab as selected', () => {
      const selected = queryAll('.work-tab').map((tab) =>
        tab.getAttribute('aria-selected'),
      );
      expect(selected).toEqual(PROJECTS.map((_, i) => (i === 0 ? 'true' : 'false')));
    });

    it('switches project when a tab is clicked', () => {
      click('.work-tab', 2);
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[2].name);
      expect(queryAll('.work-tab')[2].getAttribute('aria-selected')).toBe('true');
    });

    it('shows a padded counter for the active project', () => {
      expect(query('.work-controls__counter').textContent?.trim()).toBe(
        `01 / 0${PROJECTS.length}`,
      );
      click('.work-tab', 1);
      expect(query('.work-controls__counter').textContent?.trim()).toBe(
        `02 / 0${PROJECTS.length}`,
      );
    });

    it('advances with the next arrow', () => {
      click('.work-controls__next');
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
    });

    it('wraps to the last project with the previous arrow from the first', () => {
      click('.work-controls__previous');
      expect(query('.spotlight__title').textContent).toContain(
        PROJECTS[PROJECTS.length - 1].name,
      );
    });

    it('wraps to the first project with the next arrow from the last', () => {
      click('.work-tab', PROJECTS.length - 1);
      click('.work-controls__next');
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
    });
  });

  describe('auto-rotation', () => {
    it('advances to the next project every 3 seconds', fakeAsync(() => {
      render();
      tick(3000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
      fixture.destroy();
    }));

    it('restarts the countdown when the active tab is clicked again', fakeAsync(() => {
      render();
      tick(2000);
      click('.work-tab', 0);
      tick(2000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
      tick(1000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
      fixture.destroy();
    }));

    it('pauses while the pointer is over the section and resumes with a full interval after', fakeAsync(() => {
      render();
      query('section#work').dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      tick(4000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);

      query('section#work').dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();
      tick(2999);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
      tick(1);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
      fixture.destroy();
    }));

    it('pauses while keyboard focus is inside the section and resumes after blur', fakeAsync(() => {
      render();
      const link = query('.spotlight__link');
      focusWithKeyboard(link);
      fixture.detectChanges();
      tick(4000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);

      link.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      fixture.detectChanges();
      tick(3000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
      fixture.destroy();
    }));

    it('keeps rotating after a mouse click focuses a control', fakeAsync(() => {
      render();
      focusWithKeyboard(query('.work-tab'), false);
      fixture.detectChanges();
      tick(3000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[1].name);
      fixture.destroy();
    }));

    it('does not rotate when the user prefers reduced motion', fakeAsync(() => {
      spyOn(window, 'matchMedia').and.callFake(
        (query: string) =>
          ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList,
      );
      render();
      tick(4000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
      fixture.destroy();
    }));

    it('schedules no timers on the server', fakeAsync(() => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      render();
      tick(4000);
      fixture.detectChanges();
      expect(query('.spotlight__title').textContent).toContain(PROJECTS[0].name);
      fixture.destroy();
    }));

    it('shows a progress bar only on the active tab while rotating', () => {
      render();
      expect(queryAll('.work-tab__progress').length).toBe(1);
      expect(queryAll('.work-tab')[0].querySelector('.work-tab__progress')).toBeTruthy();
    });

    it('hides the progress bar while paused', () => {
      render();
      query('section#work').dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(queryAll('.work-tab__progress').length).toBe(0);
    });

    it('hides the progress bar when reduced motion is preferred', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      render();
      expect(queryAll('.work-tab__progress').length).toBe(0);
    });

    it('restarts the progress bar when the active tab is clicked again', () => {
      render();
      const barBefore = query('.work-tab__progress');
      click('.work-tab', 0);
      expect(query('.work-tab__progress')).not.toBe(barBefore);
    });
  });

  describe('mobile timer segments', () => {
    const segments = (): HTMLElement[] => queryAll('.work-timer__segment');

    it('renders one segment per project', () => {
      render();
      expect(segments().length).toBe(PROJECTS.length);
    });

    it('fills only the active segment while rotating', () => {
      render();
      click('.work-tab', 1);
      expect(queryAll('.work-timer__fill').length).toBe(1);
      expect(segments()[1].querySelector('.work-timer__fill')).toBeTruthy();
    });

    it('marks earlier segments completed and later ones upcoming', () => {
      render();
      click('.work-tab', 1);
      expect(segments().map((segment) => segment.classList.contains('work-timer__segment--completed')))
        .toEqual([true, false, false]);
      expect(segments().map((segment) => segment.classList.contains('work-timer__segment--active')))
        .toEqual([false, true, false]);
    });

    it('restarts the fill when the next arrow is used', () => {
      render();
      const fillBefore = query('.work-timer__fill');
      click('.work-controls__next');
      expect(segments()[1].querySelector('.work-timer__fill')).toBeTruthy();
      expect(query('.work-timer__fill')).not.toBe(fillBefore);
    });

    it('moves the fill back with the previous arrow', () => {
      render();
      click('.work-tab', 2);
      click('.work-controls__previous');
      expect(segments()[1].querySelector('.work-timer__fill')).toBeTruthy();
    });

    it('stops the fill while paused but keeps the active segment marked', () => {
      render();
      query('section#work').dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(queryAll('.work-timer__fill').length).toBe(0);
      expect(segments()[0].classList).toContain('work-timer__segment--active');
    });

    it('shows no fill when reduced motion is preferred', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      render();
      expect(queryAll('.work-timer__fill').length).toBe(0);
      expect(segments()[0].classList).toContain('work-timer__segment--active');
    });

    it('hides the segments from assistive tech since the counter already announces progress', () => {
      render();
      expect(query('.work-timer').getAttribute('aria-hidden')).toBe('true');
    });
  });
});
