import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../../ts/Sprite';
import { ViewportService } from '../../viewport-service';
import { SpriteFrameOutlineComponent } from "../sprite-frame-outline-component/sprite-frame-outline-component";
import { ChangableText } from "../../../components/changable-text/changable-text";
import { EditorStateService } from '../../editor-state-service';

@Component({
  selector: 'app-sprite-outline-component',
  imports: [SpriteFrameOutlineComponent, ChangableText],
  templateUrl: './sprite-outline-component.html',
  styleUrl: './sprite-outline-component.scss',
})
export class SpriteOutlineComponent {
  // This is a bit ugly, and shouldn't really be used, but 
  // we need to know whether this is a valid sprite name, so for 
  // now we use this only for checking the names.
  state = inject(EditorStateService);
  viewport = inject(ViewportService);

  sprite = input.required<Sprite>();
  spriteChange = output<Sprite>();

  selected = input(false);
  select = output();

  selectedFrame = signal(0);

  outline = computed(() => {
    const sprite = this.sprite();
    
    return sprite.getBounds();
  });

  x = computed(() => this.outline().left - 2 / this.viewport.zoomLevel());
  y = computed(() => this.outline().top - 2 / this.viewport.zoomLevel());
  width = computed(() => this.outline().right - this.outline().left + 4 / this.viewport.zoomLevel());
  height = computed(() => this.outline().bottom - this.outline().top + 4 / this.viewport.zoomLevel());

  styleLeft = this.viewport.computedLeft(this.x);
  styleTop = this.viewport.computedTop(this.y);
  styleWidth = this.viewport.computedSize(this.width);
  styleHeight = this.viewport.computedSize(this.height);

  updateSpriteName(text: string) {
    const resources = this.state.resources();

    const sprite = this.sprite();
    
    if(!sprite) return;
    if(resources) {
      text = resources.getFirstAvailableId(text);
    }

    const updatedSprite = sprite.setId(text);

    this.spriteChange.emit(updatedSprite);
  }

  updateFrame(old: SpriteFrame, current: SpriteFrame) {
    const sprite = this.sprite().updateFrame(old, current);

    this.spriteChange.emit(sprite);
  }
}
