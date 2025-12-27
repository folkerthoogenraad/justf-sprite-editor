import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'c-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: { class: "button" }
})
export class Button {
  disabled = input(false);

  @HostBinding("class.disabled") 
  get isDisabled() {
    return this.disabled();
  }
}
