import { booleanAttribute, Component, computed, input } from '@angular/core';

@Component({
  selector: 'c-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: { class: "host-inline-flex" }
})
export class Icon {
  icon = input("missing");
  
  x16 = input(false, { transform: booleanAttribute });
  x14 = input(false, { transform: booleanAttribute });
  x12 = input(false, { transform: booleanAttribute });
  x10 = input(false, { transform: booleanAttribute });

  url = computed(() => {
    return `images/${this.icon()}.png`;
  });
  alt = computed(() => {
    return `An icon of ${this.icon()}`;
  });

  iconClass = computed(() => {
    return `icons-${this.icon()}`;
  });
}
