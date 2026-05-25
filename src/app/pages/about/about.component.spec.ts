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
      expect(img?.src).toContain('assets/images/smallProfile.jpg');
    });

    it('should render an email social link', () => {
      const link: HTMLAnchorElement =
        fixture.nativeElement.querySelector('a[href^="mailto:"]');
      expect(link).toBeTruthy();
    });

    it('should render a LinkedIn social link', () => {
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
        'a[href*="linkedin"]',
      );
      expect(link).toBeTruthy();
    });

    it('should render a GitHub social link', () => {
      const link: HTMLAnchorElement =
        fixture.nativeElement.querySelector('a[href*="github"]');
      expect(link).toBeTruthy();
    });
  });

  describe('email copy to clipboard', () => {
    let clipboardSpy: jasmine.Spy;

    beforeEach(() => {
      clipboardSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(
        Promise.resolve(),
      );
    });

    it('should have the email button with the correct href and testid', () => {
      const btn: HTMLAnchorElement = fixture.nativeElement.querySelector(
        '[data-testid="email-btn"]',
      );
      expect(btn).toBeTruthy();
      expect(btn.href).toContain('mailto:bessjarren@yahoo.com');
    });

    it('should copy the email address to clipboard when copyEmail is called', async () => {
      component.copyEmail();
      await fixture.whenStable();
      expect(clipboardSpy).toHaveBeenCalledWith('bessjarren@yahoo.com');
    });

    it('should show a toast after copyEmail is called', async () => {
      component.copyEmail();
      await fixture.whenStable();
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(
        '[data-testid="email-toast"]',
      );
      expect(toast).toBeTruthy();
    });

    it('should hide the toast after the confirmation period', async () => {
      jasmine.clock().install();
      component.copyEmail();
      await fixture.whenStable();
      fixture.detectChanges();
      jasmine.clock().tick(2500);
      fixture.detectChanges();
      const toast = fixture.nativeElement.querySelector(
        '[data-testid="email-toast"]',
      );
      expect(toast).toBeNull();
      jasmine.clock().uninstall();
    });
  });

  describe('interests section', () => {
    it('should render the interests section', () => {
      const section = fixture.nativeElement.querySelector('.about__interests');
      expect(section).toBeTruthy();
    });

    it('should render exactly four interest cards', () => {
      const cards = fixture.nativeElement.querySelectorAll(
        '.about__interest-card',
      );
      expect(cards.length).toBe(4);
    });

    it('should render an svg icon in each interest card', () => {
      const cards: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll('.about__interest-card');
      cards.forEach((card) => expect(card.querySelector('svg')).toBeTruthy());
    });
  });
});
