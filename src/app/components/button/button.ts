import { booleanAttribute, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'c-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: { class: "button" }
})
export class Button {
  disabled = input(false,  {transform: booleanAttribute});
  small = input(false,  {transform: booleanAttribute});

  @HostBinding("class.disabled") 
  get isDisabled() {
    return this.disabled();
  }

  @HostBinding("class.small") 
  get isSmall() {
    return this.small();
  }
}
