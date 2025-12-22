import { Component, computed, inject, signal } from '@angular/core';
import { EditorStateService } from '../editor-state-service';
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-sprites-explorer',
  imports: [Button],
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

  duplicateSelected() {
    const selected = this.state.selectedSprite();

    if(!selected) return;

    const sprite = selected.setId(`${selected.id} (copy)`);

    this.state.addSprite(sprite);
  }

  deleteSelected() {
    const sprite = this.state.selectedSprite();

    if(!sprite) return;

    this.state.resources.update(r => r?.removeSprite(sprite));
  }
}
