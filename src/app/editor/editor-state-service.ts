import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Resources } from '../../ts/Resources';
import { Sprite } from '../../ts/Sprite';
import { ProjectFolderService } from './project-folder-service';
import { UndoStack } from '../../ts/utils/UndoStack';

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

  private _savedResources = signal<Resources | undefined>(undefined);
  private _resources = signal<Resources | undefined>(undefined);
  private _resourcesHistory: UndoStack<Resources|undefined> = new UndoStack();

  savedResources = this._savedResources.asReadonly();
  resources = this._resources.asReadonly();

  hasChangedSinceLastSave = computed(() => this.savedResources() !== this.resources());

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
  }

  // ================================================= //
  // Editing (moved to another service, probably?)
  // ================================================= //
  addSprite(sprite: Sprite) {
    this.updateResources(r => r?.addSprite(sprite));
  }
  removeSprite(sprite: Sprite) {
    this.updateResources(r => r?.removeSprite(sprite));
  }
  updateSprite(old: Sprite | undefined, current: Sprite | undefined) {
    if(!old) return;
    if(!current) return;

    this.updateResources(r => r?.updateSprite(old, current));
  }

  // ================================================= //
  // Editing
  // ================================================= //
  updateResources(update: (r: Resources | undefined) => Resources | undefined) {
    const r = this._resources();

    if(r === undefined) {
      return;
    }

    console.log("Updating....");

    this._resources.update(update);

    this._resourcesHistory.push(this._resources());
  }
  
  undo() {
    const previous = this._resourcesHistory.undo();

    if(!previous) return;

    this._resources.set(previous);
  }

  redo() {
    const next = this._resourcesHistory.redo();

    if(!next) return;

    this._resources.set(next);
  }

  resetHistory() {
    this._resourcesHistory.clear();
    this._resourcesHistory.push(this.resources());
  }
  resetSaved() {
    this._savedResources.set(this._resources());
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
      this._resources.set(undefined);
      this.resetHistory();
      this.resetSaved();
      return;
    }

    try {
      let content = await folder.load();

      let json = JSON.parse(content);

      let resources = Resources.deserialize(json);

      this._resources.set(resources);
      this.resetHistory();
      this.resetSaved();

      console.log("loaded!");
      console.dir(resources);
    }
    catch(e) {
      console.dir(e)
      // TODO: clear history?
      this._resources.set(new Resources([]));
      this.resetHistory();
      this.resetSaved();
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

      this.resetSaved();
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
