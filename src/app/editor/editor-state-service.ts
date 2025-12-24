import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Resources } from '../../ts/Resources';
import { Sprite } from '../../ts/Sprite';
import { ProjectFolderService } from './project-folder-service';

export enum EditorTool {
  Select,
  CreateSprite,
  CreateFrame,
  
  Pan, // View?
}

interface TextureState {
  fileName: string;
  file: File;
  url: string;
  image: HTMLImageElement;
}

@Injectable({
  providedIn: 'root',
})
export class EditorStateService {
  project = inject(ProjectFolderService);

  loading = signal(false);
  texture = signal<TextureState | undefined>(undefined);

  tool = signal(EditorTool.Select);

  resources = signal<Resources | undefined>(undefined);

  
  spritesForTexture = computed(() => {
    const texture = this.texture();
    const resources = this.resources();

    if(!texture) return [];
    if(!resources) return [];

    return resources.sprites.filter(x => x.texture === texture.fileName);
  });

  constructor() {
    effect(() => {
      this.project.folder();

      untracked(() => {
        this.reloadResources();
      });
    });
    // effect(() => {
    //   this.texture();

    //   untracked(() => {
    //     // TODO only clear selection if the new texture
    //     // is not the one for the sprite.
    //     this.selectedSpriteIds.set(new Map<string, Set<number>>());
    //   });
    // });
  }

  // ================================================= //
  // Editing (moved to another service, probably?)
  // ================================================= //
  addSprite(sprite: Sprite) {
    this.resources.update(r => r?.addSprite(sprite));
  }
  removeSprite(sprite: Sprite) {
    this.resources.update(r => r?.removeSprite(sprite));
  }
  updateSprite(old: Sprite | undefined, current: Sprite | undefined) {
    if(!old) return;
    if(!current) return;

    this.resources.update(r => r?.updateSprite(old, current));
  }
  
  // ================================================= //
  // Texture viewport (?)
  // ================================================= //
  async selectTexture(texture: string){
    if(this.texture()?.fileName === texture)  {
      return;
    }

    let file = await this.project.getFile(texture);

    if(!file) return;
    
    await this.setTextureFile(file);
  }

  async reloadTexture() {
    const texture = this.texture();

    if(!texture) return;

    let file = await this.project.getFile(texture.fileName);

    if(!file) return;
    
    await this.setTextureFile(file);
  }

  // ================================================= //
  // Resources in total
  // ================================================= //
  async reloadResources() {
    const folder = this.project.folder();

    if(!folder) {
      this.resources.set(undefined);
      return;
    }

    try {
      let content = await folder.load();

      let json = JSON.parse(content);

      let resources = Resources.deserialize(json);

      this.resources.set(resources);

      console.log("loaded!");
      console.dir(resources);
    }
    catch(e) {
      console.dir(e);
      this.resources.set(new Resources([]));
    }
  }
  async saveResources() {
    const folder = this.project.folder();
    const resources = this.resources();

    if(!folder) return;
    if(!resources) return;

    try {
      let json = resources.serialize();
      
      let content = JSON.stringify(json);
      
      await folder.save(content);
    }
    catch(e) {
      console.dir(e);
    }
  }

  private async setTextureFile(file: File) {
    const current = this.texture();

    if(current != undefined) {
      URL.revokeObjectURL(current.url);
    }

    let url = URL.createObjectURL(file);

    let image = await this.loadImage(url);

    this.texture.set({
      file: file,
      fileName: file.name,
      url: url,
      image
    });
  }

  private loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject();
      
      image.src = src;
    });
  }
}
