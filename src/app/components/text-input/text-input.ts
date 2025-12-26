import { Component, effect, model, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  value = model<string>("");

  valueInternal = signal("");

  constructor() {
    effect(() => {
      const value = this.value();

      untracked(() => {
        this.valueInternal.set(value);
      });
    });
  }
}
