import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { EditorStateService } from './editor-state-service';
import { Sprite, SpriteFrame } from '../../ts/Sprite';

export type SpriteAndFrames = { sprite: Sprite, frames: SpriteFrame[] };

@Injectable({
  providedIn: 'root',
})
export class EditorSelectionService {
  state = inject(EditorStateService);
  
  selectedSpriteIds = signal<Map<string, Set<number>>>(new Map<string, Set<number>>());

  selectedSprite = computed(() => {
    const ids = this.selectedSpriteIds();
    const resources = this.state.resources();

    if(!ids || !resources) return;

    if(ids.size === 0) return;
    if(ids.size > 1) return;

    let id = ids.keys().next().value!;
    
    return resources.getSpriteById(id);
  });
  selectedSpriteFramesIndices = computed(() => {
    const ids = this.selectedSpriteIds();
    const resources = this.state.resources();

    if(!ids || !resources) return undefined;

    if(ids.size === 0) return undefined;
    if(ids.size > 1) return undefined;

    let id = ids.keys().next().value!;
    
    return ids.get(id);
  });
  selectedSpritesAndFrames = computed(() => {
    const ids = this.selectedSpriteIds();
    const resources = this.state.resources();

    if(!ids || !resources) return undefined;

    const list: SpriteAndFrames[] = [];

    ids.forEach((frameIndices, id) => {
      const sprite = resources.getSpriteById(id);

      if(sprite === undefined) {
        return;
      }

      const frames: SpriteFrame[] = [];

      frameIndices.forEach(frameIndex => {
        frames.push(sprite.frames[frameIndex]);
      });

      return list.push({sprite: sprite, frames: frames});
    });

    return list;
  });

  // ================================================= //
  // Selection
  // ================================================= //
  isSelected(sprite: Sprite) {
    return this.selectedSpriteIds().has(sprite.id);
  }
  isFrameSelected(sprite: Sprite, frame: number) {
    const set = this.selectedSpriteIds().get(sprite.id);

    if(!set) return false;
    
    return set.has(frame);
  }
  
  select(sprite: Sprite, keepSelection: boolean) {
    this.selectedSpriteIds.update(x => {
      let map = keepSelection ? new Map(x) : new Map();

      if(!map.has(sprite.id)) {
        map.set(sprite.id, new Set());
      }

      return map;
    });

    this.state.selectTexture(sprite.texture);
  }
  selectFrame(sprite: Sprite, frame: number, keepSelection: boolean) {
    this.selectedSpriteIds.update(x => {
      let map = keepSelection ? new Map(x) : new Map();

      let set = map.get(sprite.id);

      if(set === undefined) {
        set = new Set();

        map.set(sprite.id, set);
      }

      set.add(frame);
      
      return map;
    });
  }
  
  selectAllFrames(sprite: Sprite, keepSelection: boolean = false) {
    this.selectedSpriteIds.update(x => {
      let map = keepSelection ? new Map(x) : new Map();

      let set = map.get(sprite.id);

      if(set === undefined) {
        set = new Set();

        map.set(sprite.id, set);
      }

      sprite.frames.forEach((_, frameIndex) => {
        set.add(frameIndex);
      });
      
      return map;
    });
  }

  deselectAll() {
    this.selectedSpriteIds.set(new Map());
  }
}
