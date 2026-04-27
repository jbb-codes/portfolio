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
      providers: [provideRouter([], withDisabledInitialNavigation()), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero intro text', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.hero__intro');
    expect(el?.textContent?.trim()).toBeTruthy();
  });

  it('should render hero headline', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.hero__headline');
    expect(el?.textContent?.trim()).toBeTruthy();
  });

  it('should render hero description paragraph', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.hero__description');
    expect(el?.textContent?.trim()).toBeTruthy();
  });

  it('should render CTA button with "View My Projects" text', () => {
    const btn: HTMLElement = fixture.nativeElement.querySelector('[data-testid="cta-button"]');
    expect(btn?.textContent).toContain('View My Projects');
  });

  it('should render bucket list section title "My Bucket List"', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.bucket-list__title');
    expect(el?.textContent).toContain('My Bucket List');
  });

  it('should render bucket list subtitle', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.bucket-list__subtitle');
    expect(el?.textContent?.trim()).toBeTruthy();
  });

  it('should render bucket list items', () => {
    const items = fixture.nativeElement.querySelectorAll('.bucket-list__item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render each bucket list item with a title', () => {
    const titles = fixture.nativeElement.querySelectorAll('.bucket-list__item-title');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should render each bucket list item with a description', () => {
    const descs = fixture.nativeElement.querySelectorAll('.bucket-list__item-description');
    expect(descs.length).toBeGreaterThan(0);
  });

  it('should render an even number of bucket list items for the 2-column grid', () => {
    const items = fixture.nativeElement.querySelectorAll('.bucket-list__item');
    expect(items.length % 2).toBe(0);
  });
});
