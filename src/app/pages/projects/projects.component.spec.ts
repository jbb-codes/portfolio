import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // === Begin: written with Claude guidance ===
  // These tests were written as a hands-on TDD learning exercise. Claude walked
  // through what to test and what each assertion means — I typed and implemented
  // each test as part of that process.
  it('should render the page heading "My Projects"', () => {
    const heading: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="projects-heading"]',
    );
    expect(heading?.textContent?.trim()).toBe('My Projects');
  });

  it('should render one card per project', () => {
    const cards = fixture.nativeElement.querySelectorAll(
      '[data-testid="project-card"]',
    );
    expect(cards.length).toBe(3);
  });

  it('should render a GitHub link on each card', () => {
    const links: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll(
        '[data-testid="project-github-link"',
      );
    expect(links.length).toBe(3);
    links.forEach((link) => expect(link.href).toContain('github.com'));
  });

  it('should render technology tags on each card', () => {
    const tagLists = fixture.nativeElement.querySelectorAll(
      '[data-testid="project-tech-list"',
    );
    expect(tagLists.length).toBe(3);
  });
  // === End: written with Claude guidance ===
});
