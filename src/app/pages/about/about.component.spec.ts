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
      expect(img?.src).toContain('images/smallProfile.jpg');
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

  describe('interests section', () => {
    it('should render the interests section', () => {
      const section = fixture.nativeElement.querySelector('.about__interests');
      expect(section).toBeTruthy();
    });

    it('should render exactly four interest cards', () => {
      const cards = fixture.nativeElement.querySelectorAll('.about__interest-card');
      expect(cards.length).toBe(4);
    });

    it('should render an svg icon in each interest card', () => {
      const cards: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.about__interest-card');
      cards.forEach(card => expect(card.querySelector('svg')).toBeTruthy());
    });
  });
});
