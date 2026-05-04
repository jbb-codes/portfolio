import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('profile card', () => {
    it('should render profile photo from smallProfile.jpg', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img?.src).toContain('smallProfile.jpg');
    });

    it('should render an email social link', () => {
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href^="mailto:"]');
      expect(link).toBeTruthy();
    });

    it('should render a LinkedIn social link', () => {
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href*="linkedin"]');
      expect(link).toBeTruthy();
    });

    it('should render a GitHub social link', () => {
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href*="github"]');
      expect(link).toBeTruthy();
    });
  });
});
