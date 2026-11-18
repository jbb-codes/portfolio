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

  it('should render the hero', () => {
    expect(fixture.nativeElement.querySelector('app-hero')).toBeTruthy();
  });

  describe('anchored sections', () => {
    it('should render one section for each jump-link target', () => {
      const ids = ['about', 'work', 'stack', 'bucket-list', 'contact'];
      for (const id of ids) {
        const section = fixture.nativeElement.querySelector(
          `section#${id}`,
        );
        expect(section).withContext(id).toBeTruthy();
      }
    });

    it('should order the sections as About, Work, Stack, Bucket List, Contact', () => {
      const ids = Array.from(
        fixture.nativeElement.querySelectorAll('section[id]'),
      ).map((section) => (section as HTMLElement).id);
      expect(ids).toEqual([
        'about',
        'work',
        'stack',
        'bucket-list',
        'contact',
      ]);
    });
  });
});
