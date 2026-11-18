import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import {
  provideRouter,
  Router,
  withDisabledInitialNavigation,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('particle background', () => {
    it('should render app-particle-background', () => {
      const el = fixture.nativeElement.querySelector(
        '[data-testid="particle-canvas"]',
      );
      expect(el).toBeTruthy();
    });
  });

  describe('route animation', () => {
    it('should have a route-animation-wrapper element in the main content area', () => {
      const wrapper: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="route-animation-wrapper"]',
      );
      expect(wrapper).toBeTruthy();
    });

    it('should have the router-outlet inside the animation wrapper', () => {
      const outlet: HTMLElement = fixture.nativeElement.querySelector(
        '[data-testid="route-animation-wrapper"] router-outlet',
      );
      expect(outlet).toBeTruthy();
    });
  });
});

describe('AppComponent – navbar visibility', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: '', children: [] },
          { path: '**', children: [] },
        ]),
        provideLocationMocks(),
        provideAnimations(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should hide the navbar on an unknown route', async () => {
    await router.navigateByUrl('/does-not-exist');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('header')).toBeNull();
  });

  it('should show the navbar again when a jump link adds a fragment to the home route', async () => {
    await router.navigateByUrl('/does-not-exist');
    await router.navigateByUrl('/#about');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('header')).toBeTruthy();
  });
});
