import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypingAnimationDirective } from './typing-animation.directive';

const TYPING_MS = 50;
const BLINK_MS = 500;

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [TypingAnimationDirective],
  template: `<span data-testid="typing-span" appTypingAnimation [strings]="strings"></span>`,
})
class TestHostComponent {
  strings: string[] = ['AB', 'CD'];
}

@Component({
  selector: 'single-string-host',
  standalone: true,
  imports: [TypingAnimationDirective],
  template: `<span data-testid="typing-span" appTypingAnimation [strings]="strings"></span>`,
})
class SingleStringHostComponent {
  strings: string[] = ['AB'];
}

describe('TypingAnimationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let el: HTMLElement;
  let textEl: HTMLElement;
  let cursorEl: HTMLElement;
  let matchMediaSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SingleStringHostComponent],
    }).compileComponents();

    matchMediaSpy = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    jasmine.clock().install();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement;
    textEl = el.querySelector('[data-testid="typing-text"]') as HTMLElement;
    cursorEl = el.querySelector('[data-testid="typing-cursor"]') as HTMLElement;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('DOM structure', () => {
    it('should render a typing-text child element', () => {
      expect(textEl).toBeTruthy();
    });

    it('should render a typing-cursor child element containing |', () => {
      expect(cursorEl).toBeTruthy();
      expect(cursorEl.textContent).toBe('|');
    });

    it('should mark the cursor aria-hidden', () => {
      expect(cursorEl.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('character stepping', () => {
    it('should start with empty text content', () => {
      expect(textEl.textContent).toBe('');
    });

    it('should add one character after one interval tick', () => {
      jasmine.clock().tick(TYPING_MS);
      expect(textEl.textContent).toBe('A');
    });

    it('should display the full first string after all its ticks', () => {
      jasmine.clock().tick(TYPING_MS * 2);
      expect(textEl.textContent).toBe('AB');
    });
  });

  describe('cursor visibility during typing', () => {
    it('should show the cursor before typing begins', () => {
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should keep the cursor visible while characters are being typed', () => {
      jasmine.clock().tick(TYPING_MS * 2);
      expect(cursorEl.hidden).toBeFalse();
    });
  });

  // 'AB' types in 2 ticks
  const TYPING_DONE_MS = TYPING_MS * 2;

  describe('pausing phase', () => {
    it('should keep cursor visible immediately after first string completes', () => {
      jasmine.clock().tick(TYPING_DONE_MS);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 1st blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS);
      expect(cursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 2nd blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 2);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 3rd blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 3);
      expect(cursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 4th blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 4);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 5th blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 5);
      expect(cursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 6th blink interval (3 complete blinks done)', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 6);
      expect(cursorEl.hidden).toBeFalse();
    });
  });

  // pause completes after 6 blink toggles
  const PAUSE_DONE_MS = TYPING_DONE_MS + BLINK_MS * 6;

  describe('deleting phase', () => {
    it('should remove the last character after the first delete tick', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS);
      expect(textEl.textContent).toBe('A');
    });

    it('should keep cursor visible during deletion', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should result in empty text after all characters are deleted', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS * 2);
      expect(textEl.textContent).toBe('');
    });
  });

  // 'AB' deletes in 2 ticks after pause
  const DELETE_DONE_MS = PAUSE_DONE_MS + TYPING_MS * 2;

  describe('string cycling', () => {
    it('should advance to the next string after deleting the first', () => {
      jasmine.clock().tick(DELETE_DONE_MS + TYPING_MS);
      expect(textEl.textContent).toBe('C');
    });

    it('should display the full second string after completing it', () => {
      jasmine.clock().tick(DELETE_DONE_MS + TYPING_MS * 2);
      expect(textEl.textContent).toBe('CD');
    });
  });

  describe('after last string — cursor blinks forever', () => {
    // full sequence: type 'AB' + pause + delete 'AB' + type 'CD'
    const ALL_DONE_MS = DELETE_DONE_MS + TYPING_MS * 2;

    it('should keep cursor visible immediately after last string is typed', () => {
      jasmine.clock().tick(ALL_DONE_MS);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 1st blink interval', () => {
      jasmine.clock().tick(ALL_DONE_MS + BLINK_MS);
      expect(cursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 2nd blink interval', () => {
      jasmine.clock().tick(ALL_DONE_MS + BLINK_MS * 2);
      expect(cursorEl.hidden).toBeFalse();
    });

    it('should continue blinking well past 3 cycles', () => {
      jasmine.clock().tick(ALL_DONE_MS + BLINK_MS * 9);
      expect(cursorEl.hidden).toBeTrue();
    });

    it('should leave the last string displayed', () => {
      jasmine.clock().tick(ALL_DONE_MS + BLINK_MS * 20);
      expect(textEl.textContent).toBe('CD');
    });

    it('should not change text content while blinking', () => {
      jasmine.clock().tick(ALL_DONE_MS);
      const textAtEnd = textEl.textContent;
      jasmine.clock().tick(BLINK_MS * 10);
      expect(textEl.textContent).toBe(textAtEnd);
    });
  });

  describe('single string', () => {
    let singleFixture: ComponentFixture<SingleStringHostComponent>;
    let singleTextEl: HTMLElement;
    let singleCursorEl: HTMLElement;

    beforeEach(() => {
      singleFixture = TestBed.createComponent(SingleStringHostComponent);
      singleFixture.detectChanges();
      const singleEl = singleFixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement as HTMLElement;
      singleTextEl = singleEl.querySelector('[data-testid="typing-text"]') as HTMLElement;
      singleCursorEl = singleEl.querySelector('[data-testid="typing-cursor"]') as HTMLElement;
    });

    it('should keep cursor visible immediately after the only string is typed', () => {
      jasmine.clock().tick(TYPING_MS * 2);
      expect(singleCursorEl.hidden).toBeFalse();
    });

    it('should blink cursor after the 1st blink interval', () => {
      jasmine.clock().tick(TYPING_MS * 2 + BLINK_MS);
      expect(singleCursorEl.hidden).toBeTrue();
    });

    it('should keep text content unchanged while blinking', () => {
      jasmine.clock().tick(TYPING_MS * 2 + BLINK_MS * 10);
      expect(singleTextEl.textContent).toBe('AB');
    });
  });

  describe('cleanup', () => {
    it('should cancel the interval on destroy without error', () => {
      jasmine.clock().tick(TYPING_MS);
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should not update text after destroy', () => {
      jasmine.clock().tick(TYPING_MS);
      const textAtDestroy = textEl.textContent;
      fixture.destroy();
      jasmine.clock().tick(TYPING_MS * 10);
      expect(textEl.textContent).toBe(textAtDestroy);
    });
  });

  describe('reduced motion', () => {
    let reducedFixture: ComponentFixture<TestHostComponent>;
    let reducedTextEl: HTMLElement;
    let reducedEl: HTMLElement;

    beforeEach(() => {
      matchMediaSpy.and.returnValue({ matches: false } as MediaQueryList);
      reducedFixture = TestBed.createComponent(TestHostComponent);
      reducedFixture.detectChanges();
      reducedEl = reducedFixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement;
      reducedTextEl = reducedEl.querySelector('[data-testid="typing-text"]') as HTMLElement;
    });

    it('should display the last string immediately without waiting for ticks', () => {
      expect(reducedTextEl.textContent).toBe('CD');
    });

    it('should not animate characters over time', () => {
      jasmine.clock().tick(TYPING_MS * 10);
      expect(reducedTextEl.textContent).toBe('CD');
    });

    it('should not render a cursor element', () => {
      expect(reducedEl.querySelector('[data-testid="typing-cursor"]')).toBeNull();
    });
  });
});
