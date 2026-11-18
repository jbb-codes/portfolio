import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture = TestBed.createComponent(WorkSpotlightComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
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
