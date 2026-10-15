import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorPage } from './calculator.page';

describe('Project drawer keyboard access', () => {
  let fixture: ComponentFixture<CalculatorPage>;
  let root: HTMLElement;
  let trigger: HTMLButtonElement;
  let close: HTMLButtonElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorPage);
    fixture.detectChanges();
    root = fixture.nativeElement;
    trigger = root.querySelector('.project-menu-trigger')!;
    close = root.querySelector('.drawer-heading button')!;
  });

  afterEach(() => fixture.destroy());

  function open(): void {
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
  }

  it('focuses Close on opening and makes background controls inactive', () => {
    open();
    expect(document.activeElement).toBe(close);
    trigger.focus();
    expect(document.activeElement).toBe(close);
    expect(root.querySelector('dialog')?.matches(':modal')).toBeTrue();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('restores the trigger after Close and supports reopening', () => {
    open();
    close.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    close.focus();
    expect(document.activeElement).toBe(trigger);
    open();
    expect(document.activeElement).toBe(close);
  });

  it('wraps Shift+Tab from Close and Tab from the source link', () => {
    open();
    const source = root.querySelector<HTMLAnchorElement>('.drawer-link')!;
    const backwards = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    close.dispatchEvent(backwards);
    expect(backwards.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(source);
    const forwards = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    source.dispatchEvent(forwards);
    expect(forwards.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(close);
  });

  it('restores the trigger after a native Escape cancellation', () => {
    open();
    const dialog = root.querySelector('dialog')!;
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    fixture.detectChanges();
    expect(dialog.open).toBeFalse();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes from the backdrop and leaves the calculator usable', () => {
    open();
    root.querySelector<HTMLButtonElement>('.drawer-backdrop')!.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
    close.focus();
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(close);
  });

  it('removes modal blocking when the page is destroyed while open', () => {
    open();
    const dialog = root.querySelector('dialog')!;
    fixture.destroy();
    expect(dialog.matches(':modal')).toBeFalse();
  });
});
