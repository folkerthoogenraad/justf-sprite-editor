import { Component, effect, ElementRef, model, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'c-changable-text',
  imports: [FormsModule],
  templateUrl: './changable-text.html',
  styleUrl: './changable-text.scss',
})
export class ChangableText {
  element = viewChild<ElementRef<HTMLInputElement>>("input");

  value = model("");
  open = signal(false);

  valueInternal = signal("");

  constructor() {
    effect(() => {
      const value = this.value();

      untracked(() => {
        this.valueInternal.set(value);
      });
    });
  }

  onPointerDown(evt: PointerEvent) {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.open.set(true);

    // Very ugly, but otherwise no dom update
    setTimeout(() => {
      this.element()?.nativeElement?.focus();
      this.element()?.nativeElement?.setSelectionRange(0, this.element()?.nativeElement?.value.length ?? 0);
    });
  }

  onBlur() {
    this.reset();
  }

  onInputKeyDown(evt: KeyboardEvent) {
    if(evt.key === "Enter") {
      this.commit();
    }
  }

  commit() {
    this.value.set(this.valueInternal());
    this.reset();
  }
  reset() {
    this.open.set(false);
  }
}
