import { Component, effect, HostListener, inject, signal, untracked } from '@angular/core';
import { Navbar } from "./editor/navbar/navbar";
import { SpriteCanvas } from "./editor/sprite-canvas/sprite-canvas";
import { TextureComponent } from "./editor/sprite-canvas/texture-component/texture-component";
import { ViewportService } from './editor/viewport-service';
import { EditorStateService } from './editor/editor-state-service';
import { Sidebar } from "./editor/sidebar/sidebar";
import { TexturesExplorer } from "./editor/textures-explorer/textures-explorer";
import { SpritesExplorer } from "./editor/sprites-explorer/sprites-explorer";
import { SpriteDetails } from "./editor/sprite-details/sprite-details";
import { SpriteOutlineComponent } from "./editor/sprite-canvas/sprite-outline-component/sprite-outline-component";
import { SelectComponent } from "./editor/sprite-canvas/select-component/select-component";
import { EditorSelectionService } from './editor/editor-selection-service';
import { SpriteFrameDetails } from "./editor/sprite-frame-details/sprite-frame-details";

@Component({
  selector: 'app-root',
  imports: [Navbar, SpriteCanvas, TextureComponent, Sidebar, TexturesExplorer, SpritesExplorer, SpriteDetails, SpriteOutlineComponent, SelectComponent, SpriteFrameDetails],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sprite-tile-editor');

  viewport = inject(ViewportService);
  state = inject(EditorStateService);
  selection = inject(EditorSelectionService);

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

  @HostListener("window:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    const ctrlDown = event.ctrlKey || event.metaKey;
    
    if (!ctrlDown) return;

    const key = event.key.toLowerCase();

    if (key === "z") {
      this.state.undo();
      return;
    }

    if (key === "y") {
      this.state.redo();
      return;
    }

    if (key === "s") {
      event.preventDefault();
      this.state.saveResources();
    }

  }
}
