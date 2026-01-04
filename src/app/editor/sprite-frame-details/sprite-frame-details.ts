import { Component, computed, inject, input, output } from '@angular/core';
import { Sprite, SpriteFrame } from '../../../ts/Sprite';
import { EditorStateService } from '../editor-state-service';
import { SpriteAndFrames } from '../editor-selection-service';
import { Icon } from "../../components/icon/icon";
import { NumberOrUndefinedPipe } from "../../pipes/NumberOrUndefinedPipe";
import { Button } from "../../components/button/button";
import { DropdownButton } from "../../components/dropdown-button/dropdown-button";
import { Resources } from '../../../ts/Resources';

interface SpriteFrameProperties {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  originX?: number;
  originY?: number;

  isOriginTopLeft?: boolean;
  isOriginTopCenter?: boolean;
  isOriginTopRight?: boolean;

  isOriginCenterLeft?: boolean;
  isOriginCenter?: boolean;
  isOriginCenterRight?: boolean;
  
  isOriginBottomLeft?: boolean;
  isOriginBottomCenter?: boolean;
  isOriginBottomRight?: boolean;
}

function combine<T>(frames: SpriteAndFrames[], func: (v: SpriteFrame, s: Sprite) => T): T | undefined {
  let value : T | undefined = undefined;
  let different = false;

  frames.forEach((obj) => {
    obj.frames.forEach(frame => {
      const n = func(frame, obj.sprite);

      if(value === undefined) {
        value = n;
      }
      else if(value !== n) {
        different = true;
      }
    });
  });

  if(different) return undefined;

  return value;
}
function countFrames(frames: SpriteAndFrames[]) {
  let count = 0;

  frames.forEach((obj) => {
    obj.frames.forEach(frame => {
      count += 1;
    });
  });

  return count;
}

@Component({
  imports: [Icon, NumberOrUndefinedPipe, Button, DropdownButton],
  selector: 'app-sprite-frame-details',
  templateUrl: './sprite-frame-details.html',
  styleUrl: './sprite-frame-details.scss',
})
export class SpriteFrameDetails {
  change = output<(r: Resources) => Resources>();

  spriteAndFrames = input<SpriteAndFrames[] | undefined>(undefined);

  properties = computed<SpriteFrameProperties | undefined>(() => {
    const frames = this.spriteAndFrames();
    
    if(frames === undefined) return;
    if(countFrames(frames) === 0) return;

    return {
      x: combine(frames, f => f.x),
      y: combine(frames, f => f.y),
      width: combine(frames, f => f.width),
      height: combine(frames, f => f.height),
      originX: combine(frames, f => f.originX),
      originY: combine(frames, f => f.originY),

      isOriginTopLeft: combine(frames, f => f.isOriginTopLeft()),
      isOriginTopCenter: combine(frames, f => f.isOriginTopCenter()),
      isOriginTopRight: combine(frames, f => f.isOriginTopRight()),

      isOriginCenterLeft: combine(frames, f => f.isOriginCenterLeft()),
      isOriginCenter: combine(frames, f => f.isOriginCenter()),
      isOriginCenterRight: combine(frames, f => f.isOriginCenterRight()),
      
      isOriginBottomLeft: combine(frames, f => f.isOriginBottomLeft()),
      isOriginBottomCenter: combine(frames, f => f.isOriginBottomCenter()),
      isOriginBottomRight: combine(frames, f => f.isOriginBottomRight()),
    };
  });

  setOriginPercentage(rx: number, ry: number) {
    const spritesAndFrames = this.spriteAndFrames();

    if(spritesAndFrames === undefined || countFrames(spritesAndFrames) === 0) return;

    this.change.emit(r => {
      spritesAndFrames.forEach(obj => {
        let sprite = obj.sprite;

        if(obj.frames.length === 0) return;

        obj.frames.forEach(frame => {
          sprite = sprite.updateFrame(frame, frame.setRelativeOrigin(rx, ry));
        });

        r = r.updateSprite(obj.sprite, sprite);
      });

      return r;
    });

  }
}
