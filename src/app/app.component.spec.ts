import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import {
  provideRouter,
  Router,
  withDisabledInitialNavigation,
} from '@angular/router';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
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

  describe('orb background', () => {
    it('should render the orbs immediately', () => {
      expect(
        fixture.nativeElement.querySelectorAll('[data-testid="orb"]').length,
      ).toBe(2);
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

describe('AppComponent – deferred particle background', () => {
  const particleCanvas = (fixture: ComponentFixture<AppComponent>) =>
    fixture.nativeElement.querySelector('[data-testid="particle-canvas"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
        provideAnimations(),
      ],
    }).compileComponents();
  });

  it('does not render the particle canvas during the first render', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(particleCanvas(fixture)).toBeNull();
    discardPeriodicTasks();
    flush();
    fixture.destroy();
  }));

  it('renders the particle canvas once the first paint has happened', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    expect(particleCanvas(fixture)).toBeTruthy();
    discardPeriodicTasks();
    flush();
    fixture.destroy();
  }));
});

describe('AppComponent – server render', () => {
  it('includes the orbs but not the browser-only particle canvas', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
        provideNoopAnimations(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('[data-testid="orb"]').length).toBe(2);
    expect(root.querySelector('[data-testid="particle-canvas"]')).toBeNull();
    fixture.destroy();
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
