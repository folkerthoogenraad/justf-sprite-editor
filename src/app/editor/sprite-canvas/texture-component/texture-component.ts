import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { EditorStateService } from '../../editor-state-service';
import { ViewportService } from '../../viewport-service';

@Component({
  selector: 'app-texture-component',
  imports: [],
  templateUrl: './texture-component.html',
  styleUrl: './texture-component.scss',
})
export class TextureComponent {
  // This probably doesn't even need to be like this, 
  // since we can use this as a generic component that just displays an image instead..
  state = inject(EditorStateService);
  viewport = inject(ViewportService);

  image = viewChild<ElementRef<HTMLImageElement>>("image");

  imageWidth = computed(() => {});

  style = this.viewport.computedStyle(0, 0);

  mouseDown(evt: MouseEvent) {
    evt.preventDefault();
  }
}
