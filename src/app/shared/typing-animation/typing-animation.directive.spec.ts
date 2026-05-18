import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TypingAnimationDirective } from './typing-animation.directive';

@Component({
  standalone: true,
  imports: [TypingAnimationDirective],
  template: `<span data-testid="typing-span" appTypingAnimation [strings]="strings"></span>`,
})
class TestHostComponent {
  strings: string[] = ['AB', 'CD'];
}

describe('TypingAnimationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    jasmine.clock().install();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('[data-testid="typing-span"]')).nativeElement;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('character stepping', () => {
    it('should start with empty text content', () => {
      expect(el.textContent).toBe('');
    });

    it('should add one character after one interval tick', () => {
      jasmine.clock().tick(50);
      expect(el.textContent).toBe('A');
    });

    it('should display the full first string after all its ticks', () => {
      jasmine.clock().tick(50 * 2);
      expect(el.textContent).toBe('AB');
    });
  });

  describe('string cycling', () => {
    it('should advance to the next string after completing the first', () => {
      jasmine.clock().tick(50 * 3); // complete 'AB' then first char of 'CD'
      expect(el.textContent).toBe('C');
    });

    it('should display the full second string after completing it', () => {
      jasmine.clock().tick(50 * 4); // complete 'AB' then 'CD'
      expect(el.textContent).toBe('CD');
    });

    it('should stop after the last string is complete', () => {
      jasmine.clock().tick(50 * 4);  // complete both strings, interval stops
      jasmine.clock().tick(50 * 10); // extra ticks should have no effect
      expect(el.textContent).toBe('CD');
    });
  });

  describe('cleanup', () => {
    it('should cancel the interval on destroy without error', () => {
      jasmine.clock().tick(50);
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should not update text after destroy', () => {
      jasmine.clock().tick(50);
      const textAtDestroy = el.textContent;
      fixture.destroy();
      jasmine.clock().tick(50 * 10);
      expect(el.textContent).toBe(textAtDestroy);
    });
  });
});
