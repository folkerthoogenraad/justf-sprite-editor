import { Component, computed, inject, input } from '@angular/core';
import { ViewportService } from '../../viewport-service';

@Component({
  selector: 'app-point-component',
  imports: [],
  templateUrl: './point-component.html',
  styleUrl: './point-component.scss',
})
export class PointComponent {
  viewport = inject(ViewportService);

  centered = input(true);
  clickthrough = input(true);
  absolute = input(true);

  x = input(0);
  y = input(0);

  styleLeft = this.viewport.computedLeft(this.x, this.absolute);
  styleTop = this.viewport.computedTop(this.y, this.absolute);
}
