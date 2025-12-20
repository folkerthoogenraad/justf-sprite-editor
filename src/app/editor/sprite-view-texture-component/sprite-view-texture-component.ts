import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { EditorStateService } from '../editor-state-service';
import { SpriteViewService } from '../sprite-view-service';

@Component({
  selector: 'app-sprite-view-texture-component',
  imports: [],
  templateUrl: './sprite-view-texture-component.html',
  styleUrl: './sprite-view-texture-component.scss',
})
export class SpriteViewTextureComponent {
  // This probably doesn't even need to be like this, 
  // since we can use this as a generic component that just displays an image instead..
  state = inject(EditorStateService);
  viewport = inject(SpriteViewService);

  image = viewChild<ElementRef<HTMLImageElement>>("image");

  imageWidth = computed(() => {});

  style = this.viewport.computedStyle(0, 0);

  mouseDown(evt: MouseEvent) {
    evt.preventDefault();
  }
}
