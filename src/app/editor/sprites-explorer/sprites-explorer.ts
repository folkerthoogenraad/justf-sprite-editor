import { Component, inject } from '@angular/core';
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

  duplicateSelected() {
    const selected = this.state.selectedSprite();

    if(!selected) return;

    const sprite = selected.setId(`${selected.id} (copy)`);

    this.state.addSprite(sprite);
  }
}
