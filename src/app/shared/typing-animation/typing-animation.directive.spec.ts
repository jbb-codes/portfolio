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
    it('should render a .typing-animation__text child element', () => {
      expect(textEl).toBeTruthy();
    });

    it('should render a .typing-animation__cursor child element containing |', () => {
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

  describe('string cycling', () => {
    it('should advance to the next string after completing the first', () => {
      jasmine.clock().tick(TYPING_MS * 3); // complete 'AB' then first char of 'CD'
      expect(textEl.textContent).toBe('C');
    });

    it('should display the full second string after completing it', () => {
      jasmine.clock().tick(TYPING_MS * 4); // complete 'AB' then 'CD'
      expect(textEl.textContent).toBe('CD');
    });
  });

  describe('pausing phase', () => {
    let singleFixture: ComponentFixture<SingleStringHostComponent>;
    let singleTextEl: HTMLElement;
    let singleCursorEl: HTMLElement;

    // 'AB' types in 2 ticks
    const TYPING_DONE_MS = TYPING_MS * 2;

    beforeEach(() => {
      singleFixture = TestBed.createComponent(SingleStringHostComponent);
      singleFixture.detectChanges();
      const singleEl = singleFixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement as HTMLElement;
      singleTextEl = singleEl.querySelector('[data-testid="typing-text"]') as HTMLElement;
      singleCursorEl = singleEl.querySelector('[data-testid="typing-cursor"]') as HTMLElement;
    });

    it('should keep cursor visible immediately after typing completes', () => {
      jasmine.clock().tick(TYPING_DONE_MS);
      expect(singleCursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 1st blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS);
      expect(singleCursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 2nd blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 2);
      expect(singleCursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 3rd blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 3);
      expect(singleCursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 4th blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 4);
      expect(singleCursorEl.hidden).toBeFalse();
    });

    it('should hide cursor after the 5th blink interval', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 5);
      expect(singleCursorEl.hidden).toBeTrue();
    });

    it('should show cursor after the 6th blink interval (3 complete blinks done)', () => {
      jasmine.clock().tick(TYPING_DONE_MS + BLINK_MS * 6);
      expect(singleCursorEl.hidden).toBeFalse();
    });
  });

  describe('deleting phase', () => {
    let singleFixture: ComponentFixture<SingleStringHostComponent>;
    let singleTextEl: HTMLElement;
    let singleCursorEl: HTMLElement;

    // 'AB' types in 2 ticks, then 6 blink toggles at BLINK_MS each
    const PAUSE_DONE_MS = TYPING_MS * 2 + BLINK_MS * 6;

    beforeEach(() => {
      singleFixture = TestBed.createComponent(SingleStringHostComponent);
      singleFixture.detectChanges();
      const singleEl = singleFixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement as HTMLElement;
      singleTextEl = singleEl.querySelector('[data-testid="typing-text"]') as HTMLElement;
      singleCursorEl = singleEl.querySelector('[data-testid="typing-cursor"]') as HTMLElement;
    });

    it('should remove the last character after the first delete tick', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS);
      expect(singleTextEl.textContent).toBe('A');
    });

    it('should keep cursor visible during deletion', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS);
      expect(singleCursorEl.hidden).toBeFalse();
    });

    it('should result in empty text after all characters are deleted', () => {
      jasmine.clock().tick(PAUSE_DONE_MS + TYPING_MS * 2);
      expect(singleTextEl.textContent).toBe('');
    });
  });

  describe('loop', () => {
    let singleFixture: ComponentFixture<SingleStringHostComponent>;
    let singleTextEl: HTMLElement;

    // type 2 chars → pause 6 blinks → delete 2 chars → retype
    const DELETE_DONE_MS = TYPING_MS * 2 + BLINK_MS * 6 + TYPING_MS * 2;

    beforeEach(() => {
      singleFixture = TestBed.createComponent(SingleStringHostComponent);
      singleFixture.detectChanges();
      const singleEl = singleFixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement as HTMLElement;
      singleTextEl = singleEl.querySelector('[data-testid="typing-text"]') as HTMLElement;
    });

    it('should retype the first character after deletion completes', () => {
      jasmine.clock().tick(DELETE_DONE_MS + TYPING_MS);
      expect(singleTextEl.textContent).toBe('A');
    });

    it('should retype the full string on the second loop', () => {
      jasmine.clock().tick(DELETE_DONE_MS + TYPING_MS * 2);
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
