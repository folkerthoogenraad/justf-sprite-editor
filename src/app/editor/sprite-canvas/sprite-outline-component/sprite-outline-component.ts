import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../../ts/Sprite';
import { ViewportService } from '../../viewport-service';
import { SpriteFrameOutlineComponent } from "../sprite-frame-outline-component/sprite-frame-outline-component";
import { ChangableText } from "../../../components/changable-text/changable-text";

@Component({
  selector: 'app-sprite-outline-component',
  imports: [SpriteFrameOutlineComponent, ChangableText],
  templateUrl: './sprite-outline-component.html',
  styleUrl: './sprite-outline-component.scss',
})
export class SpriteOutlineComponent {
  viewport = inject(ViewportService);

  sprite = input.required<Sprite>();
  spriteChange = output<Sprite>();

  selected = input(false);
  select = output();

  selectedFrame = signal(0);

  outline = computed(() => {
    const sprite = this.sprite();

    const left = sprite.frames.reduce((minimum, frame) => Math.min(minimum, frame.x), Infinity);
    const right = sprite.frames.reduce((maximum, frame) => Math.max(maximum, frame.x + frame.width), -Infinity);

    const top = sprite.frames.reduce((minimum, frame) => Math.min(minimum, frame.y), Infinity);
    const bottom = sprite.frames.reduce((maximum, frame) => Math.max(maximum, frame.y + frame.height), -Infinity);

    return {left, right, top, bottom};
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
    const sprite = this.sprite();
    
    if(!sprite) return;

    this.spriteChange.emit(sprite.setId(text));
  }

  updateFrame(old: SpriteFrame, current: SpriteFrame) {
    const sprite = this.sprite().updateFrame(old, current);

    this.spriteChange.emit(sprite);
  }
}
