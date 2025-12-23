import { Component, computed, inject, signal } from '@angular/core';
import { EditorStateService } from '../editor-state-service';
import { Button } from "../../components/button/button";
import { Icon } from "../../components/icon/icon";
import { ToggleButton } from "../../components/toggle-button/toggle-button";
import { SpriteExplorerItem } from "../sprite-explorer-item/sprite-explorer-item";

@Component({
  selector: 'app-sprites-explorer',
  imports: [Button, Icon, ToggleButton, SpriteExplorerItem],
  templateUrl: './sprites-explorer.html',
  styleUrl: './sprites-explorer.scss',
})
export class SpritesExplorer {
  state = inject(EditorStateService);

  showAll = signal(false);

  sprites = computed(() => {
    const all = this.showAll();

    let sprites = [];

    if(all) {
      sprites = [... this.state.resources()?.sprites ?? []];
    }
    else{
      sprites = [...this.state.spritesForTexture()];
    }

    sprites.sort((a, b) => a.id.localeCompare(b.id));

    return sprites;
  });
}
