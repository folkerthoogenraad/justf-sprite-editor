import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Navbar } from "./editor/navbar/navbar";
import { SpriteView } from "./editor/sprite-view/sprite-view";
import { SpriteViewTextureComponent } from "./editor/sprite-view-texture-component/sprite-view-texture-component";
import { SpriteViewDebugComponent } from "./editor/sprite-view-debug-component/sprite-view-debug-component";
import { SpriteViewService } from './editor/sprite-view-service';
import { EditorStateService } from './editor/editor-state-service';
import { SpriteViewSpriteOutlineComponent } from "./editor/sprite-view-sprite-outline-component/sprite-view-sprite-outline-component";

@Component({
  selector: 'app-root',
  imports: [Navbar, SpriteView, SpriteViewTextureComponent, SpriteViewSpriteOutlineComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sprite-tile-editor');

  viewport = inject(SpriteViewService);
  state = inject(EditorStateService);

  constructor() {
    effect(() => {
      const texture = this.state.texture();

      if(texture === undefined) return;
      if(texture.image === undefined) return;
      if(texture.image.width <= 0) return;

      untracked(() => {
        this.viewport.zoomToFit(texture.image.width, texture.image.height);
        this.viewport.panToCenter(texture.image.width / 2, texture.image.height / 2);
      });
    });
  }
}
