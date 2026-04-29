// Used Claude to help generate
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hero section', () => {
    it('should render CTA button with "View My Projects" text', () => {
      const btn: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="cta-button"]',
      );
      expect(btn?.textContent).toContain('View My Projects');
    });

    it('should link the CTA button to /projects', () => {
      const btn: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="cta-button"]',
      );
      expect(btn?.getAttribute('routerlink')).toBe('/projects');
    });
  });

  describe('bucket list', () => {
    it('should render section title "My Bucket List"', () => {
      const el: HTMLElement = fixture.nativeElement.querySelector(
        '.bucket-list__title',
      );
      expect(el?.textContent).toContain('My Bucket List');
    });

    it('should render at least one item', () => {
      const items =
        fixture.nativeElement.querySelectorAll('.bucket-list__item');
      expect(items.length).toBeGreaterThan(0);
    });

    it('should render a title for each item', () => {
      const titles = fixture.nativeElement.querySelectorAll(
        '.bucket-list__item-title',
      );
      expect(titles.length).toBeGreaterThan(0);
    });

    it('should render a description for each item', () => {
      const descs = fixture.nativeElement.querySelectorAll(
        '.bucket-list__item-description',
      );
      expect(descs.length).toBeGreaterThan(0);
    });

    it('should apply checked class to exactly the completed items', () => {
      const expectedCount = component.bucketList.filter(i => i.completed).length;
      const checked = fixture.nativeElement.querySelectorAll(
        '.bucket-list__checkbox--checked',
      );
      expect(checked.length).toBe(expectedCount);
    });
  });
});
