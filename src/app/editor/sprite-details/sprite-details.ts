import { Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../ts/Sprite';
import { Button } from "../../components/button/button";
import { ReadOnlyArray } from '../../../ts/utils/ReadOnlyArray';
import { SpritePreviewComponent } from "../sprite-frame-preview-component/sprite-frame-preview-component";
import { Icon } from "../../components/icon/icon";
import { SpriteDetailsFrame } from "../sprite-details-frame/sprite-details-frame";
import { SpriteProperties, SpriteProperty, SpritePropertyType } from '../../../ts/SpriteProperties';
import { TextInput } from "../../components/text-input/text-input";
import { NumberInput } from "../../components/number-input/number-input";
import { DropdownButton } from "../../components/dropdown-button/dropdown-button";
import { ToggleButton } from "../../components/toggle-button/toggle-button";
import { EditorSelectionService } from '../editor-selection-service';

@Component({
  selector: 'app-sprite-details',
  imports: [Button, SpritePreviewComponent, Icon, SpriteDetailsFrame, TextInput, NumberInput, DropdownButton, ToggleButton],
  templateUrl: './sprite-details.html',
  styleUrl: './sprite-details.scss',
})
export class SpriteDetails {  
  selection = inject(EditorSelectionService);
  sprite = input<Sprite>();
  spriteChange = output<Sprite>();

  constructor() {
    effect(() => {
      this.sprite();

      // Should we stop or just call some cool function?
      // untracked(() => { this.stopAnimation() });
    });
    effect(() => {
      const frames = this.selection.selectedSpriteFrames();

      if(!frames) return;
      if(frames.size !== 1) return;

      let frameIndex = frames.keys().next().value!;

      untracked(() => {
        this.animationPlaying.set(false);
        this.animationFrameIndex.set(frameIndex);
      });
    });
  }

  // ========================================= //
  // Updates
  // ========================================= //
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

    const updated = sprite.addFrame(new SpriteFrame(x, y, width, height, originX, originY, new SpriteProperties([])));

    this.spriteChange.emit(updated);
  }
  
  removeFrame(index: number) {
    const sprite = this.sprite();

    if(!sprite) return;

    const updated = sprite.setFrames(ReadOnlyArray.removeAt(sprite.frames, index));

    this.spriteChange.emit(updated);
  }

  updateSpriteId(id: string) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.setId(id));
  }
  updateSpriteFrameRate(rate: number) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.setFrameRate(rate));
  }

  updatePropertyName(property: SpriteProperty, name: string) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.updateProperty(property, property.setName(name)));
  }
  updatePropertyType(property: SpriteProperty, type: SpritePropertyType) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.updateProperty(property, property.setType(type)));
  }
  updatePropertyValue(property: SpriteProperty, value: any) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.updateProperty(property, property.setValue(value)));
  }
  deleteProperty(property: SpriteProperty) {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.removeProperty(property));
  }
  addNewProperty() {
    const sprite = this.sprite();

    if(!sprite) return;

    this.spriteChange.emit(sprite.addProperty(new SpriteProperty("property", "String", false, "")));
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
      this.animationPlaying.set(false);
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
