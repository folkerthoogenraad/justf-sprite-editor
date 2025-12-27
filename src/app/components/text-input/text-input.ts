import { Component, effect, ElementRef, input, model, output, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'c-text-input',
  imports: [FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  element = viewChild<ElementRef<HTMLInputElement>>("input");

  value = model<string>("");

  valueInternal = signal("");

  commit = output();
  
  border = input(true);
  valid = input(true);
  continuous = input(false);

  constructor() {
    effect(() => {
      const value = this.value();

      untracked(() => {
        this.valueInternal.set(value);
      });
    });
    effect(() => {
      this.valueInternal();
      
      const continuous = this.continuous();

      untracked(() => {
        if(continuous) {
          this.commitInternal(true);
        }
      });
    });
  }

  commitInternal(continuous: boolean) {
    const updated = this.valueInternal();

    this.value.set(updated);
    
    if(!continuous) {
      this.commit.emit();
    }
  }

  focus() {
    this.element()?.nativeElement?.focus();
  }
  focussed() {
    return document.activeElement === this.element()?.nativeElement;
  }
}
