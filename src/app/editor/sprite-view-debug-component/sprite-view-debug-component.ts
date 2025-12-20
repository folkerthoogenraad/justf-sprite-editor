import { Component, computed, inject, input } from '@angular/core';
import { SpriteViewService } from '../sprite-view-service';

@Component({
  selector: 'app-sprite-view-debug-component',
  imports: [],
  templateUrl: './sprite-view-debug-component.html',
  styleUrl: './sprite-view-debug-component.scss',
})
export class SpriteViewDebugComponent {
  viewport = inject(SpriteViewService);
  
  color = input("red");

  width = input(16);
  height = input(16);

  x = input(0);
  y = input(0);

  style = this.viewport.computedStyle(this.x, this.y);
}
