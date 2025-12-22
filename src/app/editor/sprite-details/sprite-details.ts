import { Component, input, output } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../ts/Sprite';
import { Button } from "../../components/button/button";
import { ReadOnlyArray } from '../../../ts/utils/ReadOnlyArray';

@Component({
  selector: 'app-sprite-details',
  imports: [Button],
  templateUrl: './sprite-details.html',
  styleUrl: './sprite-details.scss',
})
export class SpriteDetails {
  sprite = input<Sprite>();
  spriteChange = output<Sprite>();

  addFrame() {
    const sprite = this.sprite();

    if(!sprite) return;

    let x = 0;
    let y = 0;
    let width = 16;
    let height = 16;
    let originX = 0;
    let originY = 0;

    if(sprite.frames.length > 0) {
      const lastFrame = sprite.frames[sprite.frames.length - 1];

      x = lastFrame.x + lastFrame.width;
      y = lastFrame.y;
      width = lastFrame.width;
      height = lastFrame.height;
      originX = lastFrame.originX;
      originY = lastFrame.originY;
    }

    const updated = sprite.addFrame(new SpriteFrame(x, y, width, height, originX, originY));

    this.spriteChange.emit(updated);
  }
  
  removeLastFrame() {
    const sprite = this.sprite();

    if(!sprite) return;

    const updated = sprite.setFrames(ReadOnlyArray.removeAt(sprite.frames, sprite.frames.length - 1));

    this.spriteChange.emit(updated);
  }
}
