import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let root: HTMLElement;

  const query = (testId: string): HTMLElement | null =>
    root.querySelector(`[data-testid="${testId}"]`);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('shows the name as the page heading', () => {
    expect(root.querySelector('h1')?.textContent).toContain('Jarren Bess');
  });

  it('renders the avatar with alt text', () => {
    const avatar = query('hero-avatar') as HTMLImageElement;
    expect(avatar).toBeTruthy();
    expect(avatar.getAttribute('alt')).toBeTruthy();
  });

  it('fetches the avatar at high priority since it is the largest paint', () => {
    const avatar = query('hero-avatar') as HTMLImageElement;
    expect(avatar.getAttribute('fetchpriority')).toBe('high');
  });

  it('keeps the orbit rings static', () => {
    const rings = root.querySelectorAll('[data-testid="hero-orbit-ring"]');
    rings.forEach((ring) =>
      expect(getComputedStyle(ring).animationName).toBe('none'),
    );
  });

  it('renders decorative orbit rings hidden from assistive tech', () => {
    const rings = root.querySelectorAll('[data-testid="hero-orbit-ring"]');
    expect(rings.length).toBeGreaterThanOrEqual(2);
    rings.forEach((ring) =>
      expect(ring.getAttribute('aria-hidden')).toBe('true'),
    );
  });

  it('no longer shows the system-online status line', () => {
    expect(query('hero-status')).toBeNull();
    expect(root.textContent).not.toContain('SYSTEM ONLINE');
  });

  it('greets with "Hi, I\'m" directly above the name inside the heading', () => {
    const greeting = query('hero-greeting');
    expect(greeting?.textContent?.trim()).toBe("Hi, I'm");
    expect(root.querySelector('h1')?.contains(greeting)).toBeTrue();
    expect(
      greeting!.compareDocumentPosition(query('hero-name')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('keeps the name on its own element', () => {
    expect(query('hero-name')?.textContent?.trim()).toBe('Jarren Bess');
  });

  describe('orbiting dots', () => {
    const INNER_TEXT = 'AGENTIC AI · LLM TOOLING';
    const OUTER_TEXT = 'SECURE, CLEAN CODE';

    const dot = (name: 'inner' | 'outer'): HTMLButtonElement =>
      query(`hero-orbit-dot-${name}`) as HTMLButtonElement;

    const pointer = (
      target: Element,
      type: string,
      pointerType: 'mouse' | 'touch',
    ): void => {
      target.dispatchEvent(
        new PointerEvent(type, { pointerType, bubbles: true }),
      );
      fixture.detectChanges();
    };

    // Synthetic events: a headless browser window is not focused, so
    // element.focus() never fires focus handlers.
    const focusEvent = (target: Element, type: 'focus' | 'blur'): void => {
      target.dispatchEvent(new FocusEvent(type));
      fixture.detectChanges();
    };

    const isExpanded = (name: 'inner' | 'outer'): boolean =>
      dot(name).getAttribute('aria-expanded') === 'true';

    it('renders one dot per ring', () => {
      expect(dot('inner')).toBeTruthy();
      expect(dot('outer')).toBeTruthy();
    });

    describe('orbit motion', () => {
      const orbitSlots = (): HTMLElement[] =>
        Array.from(root.querySelectorAll<HTMLElement>('.hero__orbit-slot'));

      const definedKeyframeNames = (): string[] =>
        Array.from(document.styleSheets)
          .flatMap((sheet) => Array.from(sheet.cssRules))
          .filter(
            (rule): rule is CSSKeyframesRule => rule instanceof CSSKeyframesRule,
          )
          .map((rule) => rule.name);

      it('runs an animation on every orbiting dot', () => {
        const slots = orbitSlots();
        expect(slots.length).toBe(2);
        slots.forEach((slot) => expect(slot.getAnimations().length).toBe(1));
      });

      it('points each orbit at a keyframe that actually exists', () => {
        orbitSlots().forEach((slot) =>
          expect(definedKeyframeNames()).toContain(
            getComputedStyle(slot).animationName,
          ),
        );
      });

      // Angular renames keyframes declared in component styles but cannot
      // rewrite an `animation` shorthand that contains var(), so in the
      // production build the dots pointed at a name that did not exist and
      // never moved. A global keyframe keeps its plain name everywhere.
      it('uses the global keyframe name that no build step can rename', () => {
        orbitSlots().forEach((slot) =>
          expect(getComputedStyle(slot).animationName).toBe('orbit-revolve'),
        );
      });

      it('moves the dot around its ring as time passes', () => {
        orbitSlots().forEach((slot) => {
          const [orbit] = slot.getAnimations();
          orbit.pause();
          orbit.currentTime = 0;
          const angleAtStart = getComputedStyle(slot).getPropertyValue(
            '--orbit-angle',
          );
          orbit.currentTime = 10_000;
          const angleLater = getComputedStyle(slot).getPropertyValue(
            '--orbit-angle',
          );
          expect(angleLater).not.toBe(angleAtStart);
        });
      });
    });

    it('names each dot with its pill text', () => {
      expect(dot('inner').getAttribute('aria-label')).toBe(INNER_TEXT);
      expect(dot('outer').getAttribute('aria-label')).toBe(OUTER_TEXT);
      expect(query('hero-orbit-label-inner')?.textContent?.trim()).toBe(
        INNER_TEXT,
      );
      expect(query('hero-orbit-label-outer')?.textContent?.trim()).toBe(
        OUTER_TEXT,
      );
    });

    it('starts collapsed', () => {
      expect(isExpanded('inner')).toBeFalse();
      expect(isExpanded('outer')).toBeFalse();
    });

    it('removes the static focus pill from the portrait', () => {
      expect(query('hero-focus-tag')).toBeNull();
    });

    it('expands on mouse hover and collapses on leave', () => {
      pointer(dot('inner'), 'pointerenter', 'mouse');
      expect(isExpanded('inner')).toBeTrue();

      pointer(dot('inner'), 'pointerleave', 'mouse');
      expect(isExpanded('inner')).toBeFalse();
    });

    it('expands on keyboard focus and collapses on blur', () => {
      focusEvent(dot('outer'), 'focus');
      expect(isExpanded('outer')).toBeTrue();

      focusEvent(dot('outer'), 'blur');
      expect(isExpanded('outer')).toBeFalse();
    });

    it('collapses on Escape', () => {
      focusEvent(dot('outer'), 'focus');

      dot('outer').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      fixture.detectChanges();

      expect(isExpanded('outer')).toBeFalse();
    });

    it('toggles on tap and ignores the hover emulated by touch', () => {
      pointer(dot('inner'), 'pointerdown', 'touch');
      dot('inner').click();
      fixture.detectChanges();
      expect(isExpanded('inner')).toBeTrue();

      pointer(dot('inner'), 'pointerdown', 'touch');
      dot('inner').click();
      fixture.detectChanges();
      expect(isExpanded('inner')).toBeFalse();
    });

    it('collapses when tapping elsewhere', () => {
      pointer(dot('outer'), 'pointerdown', 'touch');
      dot('outer').click();
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();

      expect(isExpanded('outer')).toBeFalse();
    });

    it('expands one dot at a time', () => {
      pointer(dot('inner'), 'pointerdown', 'touch');
      dot('inner').click();
      pointer(dot('outer'), 'pointerdown', 'touch');
      dot('outer').click();
      fixture.detectChanges();

      expect(isExpanded('outer')).toBeTrue();
      expect(isExpanded('inner')).toBeFalse();
    });

    it('keeps an expanded pill inside a 320px wide layout', () => {
      root.style.display = 'block';
      root.style.width = '320px';

      (['inner', 'outer'] as const).forEach((name) => {
        pointer(dot(name), 'pointerenter', 'mouse');
        const hostBox = root.getBoundingClientRect();
        const dotBox = dot(name).getBoundingClientRect();

        expect(dotBox.left).toBeGreaterThanOrEqual(hostBox.left - 1);
        expect(dotBox.right).toBeLessThanOrEqual(hostBox.right + 1);
        pointer(dot(name), 'pointerleave', 'mouse');
      });
    });
  });

  it('announces the role as one phrase', () => {
    const accessible = query('hero-role')?.querySelector(
      '[data-testid="scramble-accessible"]',
    );
    expect(accessible?.textContent?.trim()).toBe('Modern Software Developer');
  });

  it('has no separate Developer label next to the role', () => {
    expect(
      query('hero-role-line')?.querySelector('.hero__role-label'),
    ).toBeNull();
    expect(query('hero-role-line')?.children.length).toBe(1);
  });

  it('links Get in touch to the contact section', () => {
    const link = query('hero-contact-button');
    expect(link?.textContent).toContain('Get in touch');
    expect(link?.getAttribute('href')).toBe('/#contact');
  });

  it('opens the resume PDF in a new tab', () => {
    const link = query('hero-resume-button');
    expect(link?.textContent).toContain('Resume');
    expect(link?.getAttribute('href')).toBe('docs/Jarren_Bess_Resume.pdf');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });
});
