import { Component, model } from '@angular/core';

@Component({
  selector: 'c-toggle-button',
  imports: [],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
})
export class ToggleButton {
  enabled = model(false);

  toggle() {
    this.enabled.update(x => !x);
  }
}
