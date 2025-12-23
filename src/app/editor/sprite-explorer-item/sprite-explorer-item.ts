import { Component, inject, input, output } from '@angular/core';
import { Sprite } from '../../../ts/Sprite';
import { Button } from "../../components/button/button";
import { Icon } from "../../components/icon/icon";
import { EditorStateService } from '../editor-state-service';
import { ViewportService } from '../viewport-service';

@Component({
  selector: 'app-sprite-explorer-item',
  imports: [Button, Icon],
  templateUrl: './sprite-explorer-item.html',
  styleUrl: './sprite-explorer-item.scss',
})
export class SpriteExplorerItem {
  viewport = inject(ViewportService);
  state = inject(EditorStateService);

  sprite = input.required<Sprite>();

  onDoubleClick() {
    const sprite = this.sprite();
    const bounds = sprite.getBounds();

    this.viewport.zoomToFit(bounds.width * 2, bounds.height * 2);
    this.viewport.panToCenter(bounds.centerX, bounds.centerY);
  }

  duplicate() {
    const sprite = this.sprite();
    const resources = this.state.resources();

    if(!resources) return;

    const updatedSprite = sprite.setId(resources.getFirstAvailableId(sprite.id));

    this.state.addSprite(updatedSprite);
  }
  
}
