import { Component, inject, input, output } from '@angular/core';
import { SpritePreviewComponent } from "../sprite-frame-preview-component/sprite-frame-preview-component";
import { Sprite } from '../../../ts/Sprite';
import { Button } from "../../components/button/button";
import { Icon } from "../../components/icon/icon";
import { EditorSelectionService } from '../editor-selection-service';

@Component({
  selector: 'app-sprite-details-frame',
  imports: [SpritePreviewComponent, Button, Icon],
  templateUrl: './sprite-details-frame.html',
  styleUrl: './sprite-details-frame.scss',
})
export class SpriteDetailsFrame {
  selection = inject(EditorSelectionService);

  sprite = input.required<Sprite>();
  frameIndex = input.required<number>();

  canDelete = input(true);

  delete = output();

  onBackgroundClicked(evt: MouseEvent) {
    this.selection.selectFrame(this.sprite(), this.frameIndex(), evt.shiftKey);
  }
}
