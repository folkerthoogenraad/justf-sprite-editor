import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../ts/Sprite';
import { Button } from "../../components/button/button";
import { ReadOnlyArray } from '../../../ts/utils/ReadOnlyArray';
import { SpritePreviewComponent } from "../sprite-frame-preview-component/sprite-frame-preview-component";
import { Icon } from "../../components/icon/icon";

@Component({
  selector: 'app-sprite-details',
  imports: [Button, SpritePreviewComponent, Icon],
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

  constructor() {
    effect(() => {
      this.sprite();

      // Should we stop or just call some cool function?
      untracked(() => { this.stopAnimation() });
    });
  }

  // ========================================= //
  // Animation stuff
  // ========================================= //
  animationFrameIndex = signal(0);
  animationPlaying = signal(false);
  animationTimeoutRequest = -1;

  playAnimation() {
    const sprite = this.sprite();
    const playing = this.animationPlaying();

    if(!sprite) return;

    if(playing) {
      return;
    }

    this.animationPlaying.set(true);
    
    this.requestAnimationFrame(sprite.frameRate);
  }
  requestAnimationFrame(rate: number) {
    if(this.animationTimeoutRequest >= 0) {
      return;
    }

    this.animationTimeoutRequest = setTimeout(() => {
      this.animationTimeoutRequest = -1;

      this.animationFrame();
    }, 1000 / rate);
  }
  cancelAnimationFrame() {
    if(this.animationTimeoutRequest < 0) {
      return;
    }

    clearTimeout(this.animationTimeoutRequest);
    this.animationTimeoutRequest = -1;
  }
  animationFrame() {
    const playing = this.animationPlaying();
    
    if(!playing) return;

    const sprite = this.sprite();

    if(!sprite) {
      this.animationPlaying.set(false); // Should we even set this?
      return;
    }

    this.nextFrame();
    this.requestAnimationFrame(sprite.frameRate);
  }
  stopAnimation() {
    this.cancelAnimationFrame();
    this.animationFrameIndex.set(0);
    this.animationPlaying.set(false);
  }

  nextFrame() {
    const sprite = this.sprite();
    let frameIndex = this.animationFrameIndex();

    if(!sprite) {
      return;
    }

    frameIndex += 1;

    if(frameIndex >= sprite.frames.length) {
      frameIndex -= sprite.frames.length;
    }

    this.animationFrameIndex.set(frameIndex);
  }

  previousFrame() {
    const sprite = this.sprite();
    let frameIndex = this.animationFrameIndex();

    if(!sprite) {
      return;
    }

    frameIndex -= 1;

    if(frameIndex < 0) {
      frameIndex += sprite.frames.length;
    }

    this.animationFrameIndex.set(frameIndex);
  }
}
