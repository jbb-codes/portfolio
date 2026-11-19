import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  it('shows the copyright with the current year', () => {
    const copyright = host.querySelector('[data-testid="footer-copyright"]');
    expect(copyright?.textContent).toContain(`${new Date().getFullYear()}`);
    expect(copyright?.textContent).toContain('Jarren Bess');
  });

  it('jumps to the About, Work, Stack and Bucket List sections', () => {
    const links = host.querySelectorAll('[data-testid="footer-nav-link"]');
    expect(Array.from(links).map((link) => link.getAttribute('href'))).toEqual([
      '/#about',
      '/#work',
      '/#stack',
      '/#bucket-list',
    ]);
  });

  it('offers only the four section links', () => {
    const links = host.querySelectorAll('a');
    expect(Array.from(links).map((link) => link.textContent?.trim())).toEqual([
      'About',
      'Work',
      'Stack',
      'Bucket List',
    ]);
  });

  it('draws no top border', () => {
    document.body.appendChild(host);
    const footer = host.querySelector('footer')!;
    expect(getComputedStyle(footer).borderTopWidth).toBe('0px');
  });

  it('places the copyright before the links', () => {
    const copyright = host.querySelector('[data-testid="footer-copyright"]')!;
    const nav = host.querySelector('nav')!;
    expect(
      copyright.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
